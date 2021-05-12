export default (worker) => {
    // if (worker === undefined) return '';
    // if (
    //     !Object.prototype.hasOwnProperty.call(worker, 'last_name')
    //     && !Object.prototype.hasOwnProperty.call(worker, 'first_name')
    //     && !Object.prototype.hasOwnProperty.call(worker, 'second_name')
    // ) return '';

    if (worker.last_name === '' && worker.first_name === '' && worker.second_name === '') {
        return '- Безымянный сотрудник -';
    }

    return `${worker.last_name} ${worker.first_name} ${worker.second_name} `;
};
