import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Col,
    Icon,
    Card,
    Popconfirm
} from 'antd';
import notification from '../../../components/notification';

const { Meta } = Card;

const confirmDelete = (id, removeService) => {
    removeService(id);
};

const cancelDelete = () => {
    notification('info', 'Удаление отменено', '');
};

const WorkerItem = (props) => {
    const {
        id,
        userID,
        name,
        description,
        img,
        removeWorker,
        settings,
        auth
    } = props;
    const { data: settingsData } = settings;
    const placeholder = settingsData && settingsData.placeholder ? `${window.location.origin}${settingsData.placeholder}` : '//schedule-dist.redken.online/v1/admin/assets/placeholder.jpg';
    const coverContent = (
        <button
            type="button"
            onClick={() => props.editWorker(id)}
            style={{ backgroundImage: `url(${img !== '' ? img : placeholder})` }}
            className="workers__items__item_image"
        />
    );
    let actions = [<Icon type="edit" onClick={() => props.editWorker(id)} />];

    if (+auth.user.user_id !== userID) {
        actions = [...actions, (
            <Popconfirm
                title="Удалить сотрудника?"
                onConfirm={() => confirmDelete(id, removeWorker)}
                onCancel={cancelDelete}
                okText="Да"
                cancelText="Нет"
            >
                <Icon type="delete" theme="twoTone" twoToneColor="#f5222d" />
            </Popconfirm>
        )];
    }

    return (
        <Col xs={24} md={12} lg={8} xl={6} xxl={4} className="workers__items__item">
            <Card
                style={{ width: '100%' }}
                cover={coverContent}
                actions={actions}
            >
                <Meta title={name} description={description} />
            </Card>
        </Col>
    );
};

WorkerItem.propTypes = {
    editWorker: PropTypes.func.isRequired,
    removeWorker: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    userID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    settings: state.settings,
    auth: state.auth
});

export default connect(mapStateToProps)(WorkerItem);
