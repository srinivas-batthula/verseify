import Blog from "@/components/Blog";



const getBlog = async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try{
        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/blogs/${id}`, {
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
                author: '',
                _id: '',
                authorName: '',
                authorBio: '',
                authorPic: {
                    secure_url: '',         //  /author.jpg
                    public_id: ''
                }, // 'https://srinivas-batthula.github.io/verseify/author.jpg'
                title: '',
                tags: [],
                media: {
                    secure_url: '',         //  /portfolio_project.png
                    public_id: ''
                }, // 'https://srinivas-batthula.github.io/verseify/portfolio_project.png'
                likes: [],
                createdAt: new Date(),
                content: "",
                authorSocials: {},
            }
        }
        else {
            return res.blog
        }
    }
    catch(err){
        return {
            author: '',
            _id: '',
            authorName: '',
            authorBio: '',
            authorPic: {
                secure_url: '',         //  /author.jpg
                public_id: ''
            },
            title: '',
            tags: [],
            media: {
                secure_url: '',         //  /portfolio_project.png
                public_id: ''
            },
            likes: [],
            createdAt: new Date(),
            content: "",
            authorSocials: {},
        }
    }
}

const getComments = async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try{
        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/db/comments/${id}`, {
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
            return []
        }
        else {
            return res.comments
        }
    }
    catch(err){
        return []
    }
}


export default async function BPage({params}){
    const { id } = await params

    const blog = await getBlog(id)
    const comments = await getComments(id)

    return(
        <Blog post={blog} comments1={comments} />
    )
}