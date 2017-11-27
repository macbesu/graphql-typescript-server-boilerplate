const {cache} = require('../config/index');

function cacheRes(stats, res) {
  const {maxAge, expires, cacheControl, lastModified, etag} = cache;

  if (expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    res.setHeader('Etag', `${stats.size}-${stats.mtime.toUTCString()}`); // mtime should be a string since it may cause errors on WINDOWS
  }
}

module.exports = function cacheRefresh(stats, req, res) {
  cacheRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('Etag')) {
    return false;
  }

  return true;
};