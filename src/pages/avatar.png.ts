import os from "node:os"
import fs from "node:fs"
import { pipeline } from "node:stream/promises"
import path from "node:path"

const githubUsername = "sorashi"
const cachedAvatarPath = path.join(os.tmpdir(), "sorashi-site-cache", `${githubUsername}.png`)
const avatarUrl = `https://github.com/${githubUsername}.png`

async function download(url, destinationPath) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
    await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true })
    await pipeline(res.body as any, fs.createWriteStream(destinationPath));
}

async function cacheAvatar() {
    console.info("Caching avatar.png")
    await fs.promises.mkdir(path.dirname(cachedAvatarPath), { recursive: true })
    await download(avatarUrl, cachedAvatarPath)
}

async function getAvatarBuffer(): Promise<Buffer> {
    try {
        await fs.promises.access(cachedAvatarPath)
        console.info("Using cached avatar.png")
    } catch (err) {
        await cacheAvatar()
    }
    try {
        return await fs.promises.readFile(cachedAvatarPath)
    } catch (err) {
        console.log(`Error while fetching avatar.png ${err}`)
        throw err
    }
}

export async function getAvatarPath(): Promise<string> {
    try {
        await fs.promises.access(cachedAvatarPath)
        console.info("Using cached avatar.png")
    } catch (err) {
        await cacheAvatar()
    }
    return cachedAvatarPath
}

export async function get({ params, request }) {
    // fetching from github `avatarUrl` is very slow, so we cache it in a tmp
    // directory for faster hot reload
    return {
        body: await getAvatarBuffer(),
        encoding: 'binary',
    }
}