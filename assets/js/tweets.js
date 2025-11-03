(function () {
// tweets.js
// Reads window.TWEETS (array of tweet objects) and window.SITE_THEME_COLOR (string)
// Sorts tweets by date desc, then title desc to mirror original Liquid pipeline
// Renders into #tweets-container preserving original markup and separators

function parseDate(d) {
    // try Date parse; fallback to epoch 0 on failure
    var dt = new Date(d);
    return isNaN(dt.getTime()) ? 0 : dt.getTime();
}

function formatDate(d) {
    // Format like "January 1, 2020" (English long month, day no leading zero, year)
    var dt = new Date(d);
    if (isNaN(dt.getTime())) {
        return d;
    }
    var month = dt.toLocaleString('en-US', { month: 'long' });
    var day = dt.getDate();
    var year = dt.getFullYear();
    return month + ' ' + day + ', ' + year;
}

function safeHTML(html) {
    // The original content likely contains HTML; we'll insert via innerHTML but ensure it's a string
    return (html == null) ? '' : String(html);
}

function cmp(a, b) {
    // Compare by date desc then title desc (reverse)
    var da = parseDate(a.date);
    var db = parseDate(b.date);
    if (da !== db) return db - da;
    var ta = (a.title || '').toString().toLowerCase();
    var tb = (b.title || '').toString().toLowerCase();
    if (ta < tb) return 1; if (ta > tb) return -1; return 0;
}

function render(tweets, themeColor) {
    var container = document.getElementById('tweets-container');
    if (!container) return;

    // Defensive copy and sort
    var list = Array.isArray(tweets) ? tweets.slice() : [];
    list.sort(cmp);

    // Build DOM
    container.innerHTML = '';
    list.forEach(function (tweet, idx) {
    var wrapper = document.createElement('div');
    wrapper.className = 'py-1';

    var dateDiv = document.createElement('div');
    dateDiv.className = 'text-sm text-gray-400';
    dateDiv.textContent = formatDate(tweet.date);
    wrapper.appendChild(dateDiv);

    var contentDiv = document.createElement('div');
    contentDiv.className = 'pt-4 px-4 prose prose-' + (themeColor || 'blue');
    // tweet.content may already contain HTML; preserve it
    contentDiv.innerHTML = safeHTML(tweet.content);
    wrapper.appendChild(contentDiv);

    // Append separator except after last
    if (idx !== list.length - 1) {
        var sepWrap = document.createElement('div');
        sepWrap.className = 'relative my-8 absolute inset-0 flex items-center';
        sepWrap.setAttribute('aria-hidden', 'true');
        var sep = document.createElement('div');
        sep.className = 'w-full border-t border-gray-200';
        sepWrap.appendChild(sep);
        wrapper.appendChild(sepWrap);
    }

    container.appendChild(wrapper);
    });
}

// Wait for DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
    render(window.TWEETS, window.SITE_THEME_COLOR);
    });
} else {
    render(window.TWEETS, window.SITE_THEME_COLOR);
}
})();
