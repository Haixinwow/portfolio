let loggedIn = {
    status: false,
    user: "",
};

export const setLoggedIn = (status, user) => {
    loggedIn.status = status;
    loggedIn.user = user;
}

export { loggedIn };
