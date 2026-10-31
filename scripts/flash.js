/* Load original public SWFs when their player is visible, including the old Play button. */
(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            var container = entry.target;
            var player = window.RufflePlayer.newest().createPlayer();
            player.style.width = '100%';
            player.style.height = '100%';
            container.appendChild(player);
            player.ruffle().load({
                url: container.getAttribute('data-swf'),
                autoplay: 'on',
                splashScreen: false,
                preferredRenderer: 'wgpu-webgl',
                backgroundColor: container.getAttribute('data-background'),
                allowScriptAccess: true,
                // GAIAttack's retired score service needs an IP-shaped value to
                // initialize. Supply a neutral value; score submissions stay disabled.
                urlRewriteRules: [
                    [/^https?:\/\/(?:www\.)?retrogamecrunch\.com\/api\/games\/2\/(?:v2\/)?ip(?:\?.*)?$/, location.origin + '/scripts/flash-ip.txt'],
                    [/^https?:\/\/(?:www\.)?retrogamecrunch\.com\/api\/games\/2\/(?:v2\/)?score\//, location.origin + '/scripts/flash-score.txt']
                ],
                parameters: Object.fromEntries(new URLSearchParams(container.getAttribute('data-flashvars') || ''))
            }).then(function () {
                container.setAttribute('data-flash-state', 'loaded');
            }).catch(function (error) {
                container.setAttribute('data-flash-state', 'error');
                console.error('Unable to load archived Flash movie', container.getAttribute('data-swf'), error);
            });
        });
    });
    document.querySelectorAll('[data-swf]').forEach(function (container) { observer.observe(container); });
}());
