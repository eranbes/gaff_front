const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export const SERVER = isLocalhost
    ? 'http://127.0.0.1:8000/'
    : window.location.href === 'https://app.gaff.u0087004.plsk.regruhosting.ru/'
        ? 'https://gaff.u0087004.plsk.regruhosting.ru/'
        : window.location.href