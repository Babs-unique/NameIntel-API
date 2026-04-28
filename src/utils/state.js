import crypto from 'crypto';


const state = new Map();

const generateState = () => {
    const newState = crypto.randomBytes(32).toString('hex');
    state.set(newState, true);
    return newState;
}

const validateState = (stateParam) => {
    const isValid = state.get(stateParam);
    state.delete(stateParam);
    return isValid;
}

export { generateState, validateState };