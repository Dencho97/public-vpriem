import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { disconnectWSAction } from '../ws/actions';

const WrapperAuth = (Component) => {
    class WrapperAuthChild extends React.PureComponent {
        static pathPage = Component.pathPage;

        static namePage = Component.namePage;

        componentDidMount() {
            const { ws } = this.props;
            if (ws.ws) {
                disconnectWSAction();
            }
        }

        render() {
            document.title = `${Component.namePage} | ВедёмПриём`;

            return (
                <section className="auth wrapper">
                    <Component {...this.props} />
                </section>
            );
        }
    }

    WrapperAuthChild.propTypes = {
        ws: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
        settings: state.settings
    });

    return connect(mapStateToProps)(WrapperAuthChild);
};

export default WrapperAuth;
