import { client as apiClient } from '../api';

// Users

// GET Users
export const getUsers = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users')
    return response.data
}
// GET User
export const getUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users/' + params.userId)
    return response.data
}
// Delete User
export const delUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.delete('/users/' + params.userId)
    return response.data
}

// Communitiess

// GET Communities
export const getCommunities = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/communities')
    return response.data
}

// GET Communities
export const getCommunitiesGroupBy = async ({queryKey}) => {
    const [_, params] = queryKey
    console.log("sktat")
    console.log(params.interval)
    const response = await apiClient.get('/communities_groupby/' + params.groupBy,
       { params: { interval : params.interval, count_interval: params.count_interval }})
    console.log(response)
    return response.data
}
// GET Community
export const getCommunity = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/communities/' + params.communityId)
    return response.data
}
// Delete Community
export const delCommunity = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.delete('/communities/' + params.communityId)
    return response.data
}