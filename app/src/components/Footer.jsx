import React from 'react';
import { Layout } from 'antd';
import moment from 'moment';

moment.locale('ru');

const { Footer: FooterAnt } = Layout;

const Footer = () => (
    <FooterAnt style={{ textAlign: 'center' }}>{`ВедёмПриём ©${moment().format('YYYY')}`}</FooterAnt>
);

export default Footer;
