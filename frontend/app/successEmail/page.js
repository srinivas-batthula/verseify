

export default function SuccessPage(){

    return(
        <div style={{color:'black', background: 'linear-gradient(135deg, #6dd5ed, #00c851, #00796b)', width:'100%', height:'100vh', overflow:'hidden', textAlign:'center', display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center', flexDirection:'column'}}>
            <div style={{fontWeight:'bold', fontSize:'1.5rem'}}>
                Verification Link successfully Sent to your Email!
            </div>
            <div style={{color:'red', fontSize:'1.1rem'}}>
                Please Follow the instructions provided in the Mail to Reset your Forgotten Password...
            </div>
        </div>
    )
}