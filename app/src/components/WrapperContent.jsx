import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Header from './Header';
import Footer from './Footer';
import { disconnectWSAction } from '../ws/actions';

const { Content } = Layout;

const style = {
    background: '#fff',
    padding: 25,
    height: 'calc(100% - 54px)',
    overflow: 'auto'
};

const WrapperContent = (Component) => {
    class WrapperContentChild extends React.PureComponent {
        static pathPage = Component.pathPage

        static namePage = Component.namePage

        componentDidMount() {
            const { ws } = this.props;
            if (ws.ws) {
                disconnectWSAction();
            }
        }

        render() {
            document.title = `${Component.namePage} | ВедёмПриём`;

            return (
                <section className="app wrapper">
                    <Layout className="app layout">
                        <Header />
                        <Content className="app content">
                            <div style={style}>
                                <Component {...this.props} />
                            </div>
                        </Content>
                        <Footer />
                    </Layout>
                </section>
            );
        }
    }

    const mapStateToProps = state => ({
        settings: state.settings
    });

    WrapperContentChild.propTypes = {
        ws: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    return connect(mapStateToProps)(WrapperContentChild);
};

export default WrapperContent;
