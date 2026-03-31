import { test } from '../../utils/fixtures'
import { expect } from '../../utils/custom-expect'
import addAUserPayload from '../../request-objects/user/POST-newUser.json'


test('get all users', async ({ api }) => {
    const getUsersResponse = await api
        .path('/users')
        .getRequest(200)
    await expect(getUsersResponse).shouldMatchSchema('user', 'GET_all_users')
    expect(getUsersResponse.users.length).shouldBeLessThanOrEqual(30)
})

test('get a single user', async ({ api }) => {
    const singleUserResponse = await api
        .path('/users/1')
        .getRequest(200)
    await expect(singleUserResponse).shouldMatchSchema('user', 'GET_single_user')
    expect(singleUserResponse.id).shouldEqual(1)
})

test('get current auth user', async ({ api }) => {
    const getCurrentUserResponse = await api
        .path('/auth/me')
        .getRequest(200)
    await expect(getCurrentUserResponse).shouldMatchSchema('user', 'GET_current_auth_user')
    expect(getCurrentUserResponse.firstName).shouldEqual('Sophia')
})

test('add a user', async ({ api }) => {
    const userRequestBody = JSON.parse(JSON.stringify(addAUserPayload))

    const addUserResponse = await api
        .path('/users/add')
        .body(userRequestBody)
        .postRequest(201)
    await expect(addUserResponse).shouldMatchSchema('user', 'POST_add_user')
    expect(addUserResponse.firstName).toEqual('John')
    expect(addUserResponse.lastName).toEqual('Doe')
})

test('update a user', async ({ api }) => {
    const UpdateUserResponse = await api
        .path('/users/2')
        .body({ lastName: 'Owais' })
        .putRequest(200)
    await expect(UpdateUserResponse).shouldMatchSchema('user', 'PUT_update_user')
    expect(UpdateUserResponse.firstName).toEqual('Michael')
})