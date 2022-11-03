---
title: How to fix Facebook archive JSON encoding
date: 2019-09-13
lastmod: 2022-01-04T00:35:00+01:00
slug: fix-facebook-json-archive-encoding
---

Facebook has a great feature which allows you to download an archive of your data. This includes content of messages from Messenger, posts, photos and videos, comments etc.

This allows you to display interesting statistics if you can work with JSON in a programming language. For example, whom did you message the most in the last 30 days? Who of your friends writes the longest messages? Imagination is your only limit.

To request an archive of your messages follow these image clues (from Facebook settings):

![Image clue 1](https://i.imgur.com/36BOBKr.png)

![Image clue 2](https://i.imgur.com/Uun4uJe.png)

You might see a problem after you download your archive and load it in your script/program though. If you have any Unicode characters in your data Facebook's JSON strings will get corrupted when you parse them. It took me longer than it should to find out what's going on. And that's why I write this article - in hope to help others who find themselves in this situation.

## What's going on

Facebook apparently represents UTF-8 characters in a broken way. Instead of outputting one `\u` escape sequence for each Unicode character, Facebook actually outputs two or more in their JSON strings. An example of a Unicode character in a Facebook JSON file is `\u00c5\u0099`. This is supposed to be a single character `\u0159` or Latin Small Letter R with Caron - `ř`. So what's going on? It's simple - Facebook doesn't understand Unicode as a single character, but rather as separate bytes. In our case the bytes `c5 99` in hexadecimal.

The problem is that when Facebook puts `\u00c5\u0099` in a JSON string, most JSON prasers understand that as two Unicode characters. That's because the escape sequence `\u00c5` is actually the Unicode code for `Å` and `\u0099` is a Unicode control character. `Å` is represented as two bytes in a proper UTF-8 file - `c3 85` in hexadecimal. Same for `\u0099` - two bytes - `c2 99`.

In other words Facebook meant to output two single bytes, but ended up outputting the Unicode characters with their respective Unicode numbers being the bytes' values in hexadecimal, which is actually four bytes in total. That is totally wrong and doesn't make any sense at all! I hope Facebook realizes this soon and fixes it so others don't have to enjoy this great experience of additional trouble.

So when Facebook says `\u00c5\u0099` they actually mean two separate bytes - `c5 99`. That is the byte sequence for the Unicode character `\u0159` - `ř`.

## How to fix that

Use Regex to find all `\u00hh` sequences and replace them with the byte with the value of `hh`. The regex:

```regex
\\u00([a-f0-9]{2})
```

Here is a **Ruby** script that fixes all JSON files in your message inbox. Then outputs the result.

```ruby
path = '../messages/inbox'
Dir["#{path.sub('[\\/]$', '')}/**/message_1.json"].
each{|file|
    File.write(file,
        File.read(file)
        .gsub(/\\u00([a-f0-9]{2})/) { |m| $1.to_i(16).chr }
    )
    puts "Done #{file}"
}
```

Snippet for **PHP**, which fixes all occurrences in `$your_input_text` and `echo`es the result.

```php
function replace_with_byte($match) {
    return chr(hexdec($match[1]));
}
echo preg_replace_callback('/\\\\u00([a-f0-9]{2})/', 'replace_with_byte', $your_input_text);
```

**Python** version (might need some performance improvements):

```python
import re

text = "This is some text with the letter \\u00c5\\u0099 inside"
replaced = re.sub(r'\\u00([a-f0-9]{2})', lambda x: chr(int(x.group(1), 16)), text)

print(repr(replaced)) # 'This is some text with the letter Å\x99 inside'

buffer = [ord(c) for c in replaced]
result = bytes(buffer).decode('utf-8')
print(result) # This is some text with the letter ř inside
```
