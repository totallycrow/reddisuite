


const getabcRequest = "https://oauth.reddit.com/api/v1/me/prefs"

const fetchSingleAbc = (data) => {
    return axios(getabcRequest, {data})
}

const fetchMultipleAbc = (data) => {
    const requests = data.map(el => {
        return () => axios(getabcRequest, {el.data})
    })

  return Promise.all(requests)
}


export {
    fetchSingleAbc
}