import Profile from "@/components/Profile";



const getUser = async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try{
        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application',
                'Authorization': token,
            },
            credentials: 'include',
        })
        res = await res.json()
        // console.log(res)

        if (!res || !res.success) {
            return {
                _id: '1',
                following: [],
                username: '',
                email: '',
                subscription: {},
                bio: '',
                profile_pic: {
                    secure_url: '',
                    public_id: '',
                },
                social_links: {
                    linkedin: '',
                    github: '',
                    twitter: '',
                },
            }
        }
        else {
            return res.user
        }
    }
    catch(err){
        return {
            _id: '1',
            following: [],
            username: '',
            email: '',
            subscription: {},
            bio: '',
            profile_pic: {
                secure_url: '',
                public_id: '',
            },
            social_links: {
                linkedin: '',
                github: '',
                twitter: '',
            },
        }
    }
}


export default async function Page({params}){
    const { id } = await params

    const user = await getUser(id)


    return(
        <Profile user1={user} />
    )
}