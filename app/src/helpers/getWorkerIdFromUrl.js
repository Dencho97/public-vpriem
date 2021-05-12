export default function getWorkerIdFromUrl() {
    const { pathname } = window.location;
    const regexp = new RegExp('\\/\\d+\\/', 'gm');
    let id = regexp.exec(pathname);
    id = id ? id[0].split('/') : null;

    if (id === null) return null;

    return id.length === 3 ? +id[1] : null;
}
