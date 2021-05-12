export default function getDateFromUrl() {
    const { pathname } = window.location;
    const regexp = new RegExp('\\d{4}-\\d{1,2}-\\d{1,2}', 'gm');
    const date = regexp.exec(pathname);

    return date ? date[0] : null;
}
