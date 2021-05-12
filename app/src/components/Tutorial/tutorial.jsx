/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';

import { history } from '../../store';
import { DICTIONARY_WORKERS_ROUTE } from '../../constans/routes';
import { switchDrawer } from '../../pages/dictionary/workers/actions';
import { setTutorialAction } from './actions';
import './style.scss';

class Tutorial extends React.Component {
    introJsOriginalRef = React.createRef()

    state = {
        currentStep: 0
    }

    onExit = (stepIndex) => {
        const { dispatch } = this.props;

        if (stepIndex !== 7 && stepIndex !== undefined) {
            dispatch(setTutorialAction(null, false));
        }
    }

    onComplete = () => {
        const { dispatch } = this.props;

        dispatch(setTutorialAction('addWorkers', true));
    }

    onBeforeChange = (nextStepIndex) => {
        const { tutorial, dispatch } = this.props;
        const { currentStep } = this.state;

        if (tutorial.active && tutorial.lastTutorial === 'addWorkers' && nextStepIndex === 1 && currentStep === 0) {
            this.setState({ currentStep: nextStepIndex });
            history.push(`${DICTIONARY_WORKERS_ROUTE}/create`);
            dispatch(switchDrawer('show_create'));
            return false;
        }
        return true;
    }

    onPreventChange = (stepIndex) => {
        const { currentStep } = this.state;

        if (stepIndex === 0 && currentStep === 1) {
            this.setState({ currentStep: 2 });
            setTimeout(() => {
                this.introJsOriginalRef.introJs.goToStep(1).start();
            }, 600);
        }
    }

    render() {
        const { tutorial } = this.props;
        const localTutorial = JSON.parse(localStorage.getItem('tutorial'));
        const { location } = history;
        const isMobile = window.matchMedia('(max-width: 991px)').matches;

        if (localTutorial === null || tutorial.lastTutorial === null || isMobile) return null;

        const currentTutorialPoint = tutorial.tutorialsList[tutorial.lastTutorial];

        if (
            (location.pathname === '/schedule' && tutorial.lastTutorial === 'start')
            || ((location.pathname === '/dictionary/workers' || location.pathname === '/dictionary/workers/create') && tutorial.lastTutorial === 'addWorkers')
        ) {
            return (
                <Steps
                    enabled={currentTutorialPoint.stepsEnabled}
                    steps={currentTutorialPoint.steps}
                    initialStep={currentTutorialPoint.initialStep}
                    onExit={this.onExit}
                    onComplete={this.onComplete}
                    onBeforeChange={this.onBeforeChange}
                    onPreventChange={this.onPreventChange}
                    ref={(steps) => { this.introJsOriginalRef = steps; }}
                    options={{
                        nextLabel: 'Далее',
                        prevLabel: 'Назад',
                        skipLabel: 'Пропустить обучение',
                        doneLabel: 'Завершить',
                        showProgress: true,
                        showBullets: false,
                        exitOnEsc: false,
                        exitOnOverlayClick: false,

                    }}
                />
            );
        }

        return null;
    }
}

Tutorial.propTypes = {
    tutorial: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    tutorial: state.tutorial
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(Tutorial);
