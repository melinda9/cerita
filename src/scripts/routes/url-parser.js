const UrlParser = {
  parseActiveUrl() {
    const urlSplit = this._urlSplitter(window.location.hash.slice(1));
    if (!urlSplit.length) {
      return { resource: null, id: null, verb: null };
    }

    return {
      resource: urlSplit[0] || null,
      id: urlSplit[1] || null,
      verb: urlSplit[2] || null,
    };
  },

  parseActiveUrlWithCombiner() {
    const url = this.parseActiveUrl();
    let combined = this._urlCombiner(url);

    // tangani dynamic route /detail/:id
    if (url.resource === 'detail' && url.id) {
      combined = '/detail/:id';
    }
    return combined;
  },

  _urlSplitter(url) {
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    return normalizedUrl.split("/").filter(Boolean);
  },

  _urlCombiner({ resource, id, verb }) {
    return (
      (resource ? `/${resource}` : "/") +
      (id ? "/:id" : "") +
      (verb ? `/${verb}` : "")
    );
  },
};

export default UrlParser;