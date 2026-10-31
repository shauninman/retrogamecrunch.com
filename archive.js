const archiveQueries={"/journal/?page=2": "/journal/page/2/", "/journal/?page=3": "/journal/page/3/", "/journal/?page=4": "/journal/page/4/", "/journal/?page=5": "/journal/page/5/", "/journal/?page=6": "/journal/page/6/", "/journal/?page=7": "/journal/page/7/", "/journal/?page=8": "/journal/page/8/", "/journal/?page=9": "/journal/page/9/"};
const archiveKey=location.pathname+"?"+new URLSearchParams([...new URLSearchParams(location.search)].sort()).toString();
if(location.search && archiveQueries[archiveKey]) location.replace(archiveQueries[archiveKey]+location.hash);

/* Shared archive behavior. The build prepends the legacy pagination URL map. */
/* Relative wording and successive rounding match RGC's original PHP ago(). */
function archiveAgo(timestamp, now) {
    if (timestamp === 0) return 'Never';
    var diff = now - timestamp;
    if (diff < 60) return 'Just now';
    diff = Math.round(diff / 60);
    if (diff < 60) return diff + ' minute' + (diff > 1 ? 's' : '') + ' ago';
    diff = Math.round(diff / 60);
    if (diff < 24) return diff + ' hour' + (diff > 1 ? 's' : '') + ' ago';
    diff = Math.round(diff / 24);
    if (diff < 7) return diff > 1 ? diff + ' days ago' : 'Yesterday';
    diff = Math.round(diff / 7);
    if (diff < 12) return diff > 1 ? diff + ' weeks ago' : 'Last week';
    // PHP's months branch cannot return: it tests <12 inside the >=12 branch.
    diff = Math.round(diff / 52);
    return diff > 1 ? 'Around ' + diff + ' years ago' : 'Last year';
}

function cleanup() {
    var now = Math.floor(Date.now() / 1000);
    document.querySelectorAll('.datetime').forEach(function (node) {
        var original = node.getAttribute('data-datetime') || node.textContent.trim();
        var timestamp = node.getAttribute('data-timestamp');
        if (timestamp === null) {
            var parts = /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(original);
            if (!parts) return;
            timestamp = Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6]) / 1000;
        }
        timestamp = Number(timestamp);
        if (!Number.isFinite(timestamp)) return;
        node.setAttribute('data-datetime', original);
        node.title = original + ' UTC';
        node.textContent = archiveAgo(timestamp, now);
    });
    document.querySelectorAll('.dateyear').forEach(function (node) {
        node.textContent = new Date().getFullYear();
    });
}
