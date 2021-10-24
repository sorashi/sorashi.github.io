---
layout: post
title: The .NET Drama of PR 22217
date: 2021-10-24
lastmod: 2021-10-24
slug: net-drama
---

On October 20th, the PR [#22217](https://github.com/dotnet/sdk/pull/22217) was
created (and later merged) in the [dotnet/sdk](https://github.com/dotnet/sdk)
repository. This change, named *Remove Hot Reload support from dotnet watch*,
removed this awaited feature from the dotnet CLI and left it available only in
Visual Studio 2022. Note that this change was done a few days before .NET 6
release (realising on 2021-11-08), removing it from this version. The PR removed
around 2,500 lines of code from the .NET SDK.

Microsoft explained their reasoning in a blog post called [Update on .NET Hot
Reload progress and Visual Studio 2022
Highlights](https://devblogs.microsoft.com/dotnet/update-on-net-hot-reload-progress-and-visual-studio-2022-highlights/).

> With these considerations, we've decided that starting with the upcoming .NET
> 6 GA release, we will enable Hot Reload functionality only through Visual
> Studio 2022 so we can focus on providing the best experiences to the most
> users. \[...\] To clarify, we are not releasing Hot Reload as a feature of the
> `dotnet watch` tool.

This statement and removal resulted in a large backlash and discussion from the
open-source .NET community. The Verge covers this story with information from
the inside of Microsoft in their article called [Microsoft angers the .NET open
source community with a controversial
decision](https://www.theverge.com/2021/10/22/22740701/microsoft-dotnet-hot-reload-removal-decision-open-source).
The main complains were that the feature should keep cross-platform support and
not limit it to Windows (and later Mac through VS for Mac).

One of the protesting developer created the PR
[#22262](https://github.com/dotnet/sdk/pull/22262/) reverting the changes. This
PR is one of the most (if not *the* most) approved PR in the history of GitHub,
accumulating 417 unique approving reviews with a total of 523 PR participants at
the time of writing.

This PR was merged in around 29 hours

![PR merge](../net-drama-merge.png)

with a follow-up blog post ([.NET Hot Reload Support via
CLI](https://devblogs.microsoft.com/dotnet/net-hot-reload-support-via-cli/))
from Microsoft apologizing about the change.

This decision was followed by another story from The Verge called [Microsoft
reverses controversial .NET change after open source community
outcry](https://www.theverge.com/2021/10/23/22742282/microsoft-dotnet-hot-reload-u-turn-response).