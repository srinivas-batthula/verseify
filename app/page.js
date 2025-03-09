import HomePage from '@/components/Home'



const getBlogs = async () => {
    try{
        let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/db/blogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application',
            },
        })
        res = await res.json()
        console.log(res)

        if (!res || !res.success) {
            return { blogs: [], page: 0, totalBlogs: 0, totalPages: 0 }
        }
        else {
            return { blogs: res.blogs, page: res.page, totalBlogs: res.totalBlogs, totalPages: res.totalPages }
        }
    }
    catch(err){
        return { blogs: [], page: 0, totalBlogs: 0, totalPages: 0 }
    }
}


export default async function HPage(){
    const data1 = await getBlogs()

    return(
        <div>
            <HomePage data1={data1} />
        </div>
    )
}
