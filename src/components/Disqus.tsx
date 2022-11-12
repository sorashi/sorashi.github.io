import { useEffect } from "preact/hooks"
interface Props {
    canonicalUrl: string,
    pageIdentifier: string,
}

export default function Disqus({ canonicalUrl, pageIdentifier }: Props) {
    function getDisqusConfig() {
        return function() {
            this.page.url = canonicalUrl
            this.page.identifier = pageIdentifier
        }
    }
    useEffect(() => {
        const w = (window as Record<string, any>)
        if (w && w.DISQUS) {
            w.DISQUS.reset({
                reload: true,
                config: getDisqusConfig()
            })
        } else {
            w.disqus_config = getDisqusConfig()
        }
    }, [canonicalUrl, pageIdentifier])
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://sorashi.disqus.com/embed.js'
        script.async = true
        script['data-timestamp'] = String(Number(new Date()))
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])
    return <>
        <div id="disqus_thread"></div>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
    </>
}
