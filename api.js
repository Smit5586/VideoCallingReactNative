// export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwYWQzZTJkNC1lOTQyLTQ3ZDgtYTUyYi05YTVkMjNlZWRkYzAiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyOTA1Nzk3OCwiZXhwIjoxNzI5MTQ0Mzc4fQ.nKGWGTko6ZkVoLwNTnLSiLShX7JnI84OQ4xEP5_vwyQ"
// export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1ODk0N2VjYi0xZDM3LTQyODgtYTA2OC1iOGUyNjYyNmM0YjYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyOTIzMDU2MCwiZXhwIjoxNzI5MzE2OTYwfQ.dMcBljCMi8OxobiTgj33OCIXd2yY829BHtZAFeGRzug"
export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1ODk0N2VjYi0xZDM3LTQyODgtYTA2OC1iOGUyNjYyNmM0YjYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyOTQ4NzQ5MywiZXhwIjoxNzM3MjYzNDkzfQ.Suo-qtWAJc-A7OopmH3iD7uplZIttJE_XDslEXZ1Jh0"
// API call to create meeting
export const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    // console.log("res.json()", res);

    const { roomId } = await res.json();
    // console.log("roomId", roomId);
    return roomId;
};

export const validateMeeting = async ({ meetingId, token }) => {
    const url = `https://api.videosdk.live/v2/rooms/validate/${meetingId}`;

    const options = {
        method: "GET",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
    };
    console.log("validateMeeting url", url);
    console.log("validateMeeting options", options);

    const result = await fetch(url, options)
        .then((response) => response.json()) //result will have meeting id
        .catch((error) => {
            // console.error("error", error)
        });

    return result ? result.roomId === meetingId : false;
};