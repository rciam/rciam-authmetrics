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