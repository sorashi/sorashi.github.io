from PIL import Image
import requests
from io import BytesIO

# This whole script was done using Google and StackOverflow
# How to generate ico files
# https://stackoverflow.com/a/36168447/1697953
# How to get GitHub avatar location from username
# https://stackoverflow.com/a/36380674/1697953
# How to read image data from URL
# https://stackoverflow.com/a/23489503/1697953
# How to follow redirects in requests
# https://stackoverflow.com/a/50606372/1697953

avatarUrl = 'https://github.com/sorashi.png'

if __name__ == "__main__":
    r = requests.head(avatarUrl, allow_redirects=True)
    print('Avatar located at ' + r.url)
    response = requests.get(r.url)
    img = Image.open(BytesIO(response.content))
    img.save('favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])