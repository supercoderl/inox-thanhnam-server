const AuthService = {
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    saveAccessToken: (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
    },

    saveRefreshToken: (refreshToken) => {
        localStorage.setItem("refreshToken", refreshToken);
    },

    saveUser: (user) => {
        localStorage.setItem("user", user);
    },

    getUser: () => {
        return localStorage.getItem("user");
    },
};

export default AuthService;