export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})()`,
        }}
      />
      <link rel="alternate" type="application/rss+xml" title="Blixamo RSS" href="/feed.xml" />
    </>
  )
}
