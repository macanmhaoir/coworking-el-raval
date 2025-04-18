let auth0 = null

window.onload = async () => {
    await configureClient()
    await processLoginState()
    updateUI()
}

const configureClient = async () => {
    auth0 = await createAuth0Client({
        domain: "coworking-el-raval.eu.auth0.com",
        client_id: "RIvMvuajgBdGr0HADp2PWq9xZuTGZO12",
    })
}

const processLoginState = async () => {
    // Check code and state parameters
    const query = window.location.search
    if (query.includes("code=") && query.includes("state=")) {
        // Process the login state
        await auth0.handleRedirectCallback()
        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, window.location.pathname)
    }
}

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated()
    document.getElementById("btn-logout").disabled = !isAuthenticated
    document.getElementById("btn-login").disabled = isAuthenticated
    // NEW - add logic to show/hide gated content after authentication
    if (isAuthenticated) {
        console.log('isAuthenticated' + isAuthenticated)
        document.getElementById("gated-content").classList.remove("hidden")
        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0.getTokenSilently()
        document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(
            await auth0.getUser()
        )
    } else {
        document.getElementById("gated-content").classList.add("hidden")
    }
}

const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.href,
    })
}

const logout = () => {
    auth0.logout({
        returnTo: window.location.href,
    })
}