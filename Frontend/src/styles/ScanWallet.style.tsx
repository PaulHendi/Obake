import styled from "styled-components";


export const NewLotteryContainer = styled.div`
    justify-content: center;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 2%;
    margin-bottom: 2%;
    align-items: center;
    background-color: #F5F5F5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    h1 {
        text-align: center;
    }
`

export const ScanWalletContainer = styled.div`

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 2%;
    margin-bottom: 2%;
    margin-left: 2%;
    margin-right: 2%;
    background-color: #F5F5F5;
    padding: 20px;

    img{
        width: 200px;
        height: 200px;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    p {
        margin-left: 40%;
        margin-right: 35%;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
 
    

`


export const RaffleCreatedContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;
    padding: 20px;
`


export const StartLotteryContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;
    padding: 20px;

    img{
        width: 30%;
        height: auto;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    input{
        width: 20%;
        margin-top: 1%;
        border-radius:24px;
        text-align: center;
        border: solid;
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }   
        height: 30px;     
     
    }
    button{
        width: 20%;
        margin-top: 1%;
        border-radius:24px;
        text-align: center;   
        height: 30px;     
    }
`  

export const ApproveContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;

    img{
        width: 30%;
        height: auto;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        margin-bottom: 20px;
    }
  
    button{
        width: 20%;
        margin-top: 1%;
        border-radius:24px;
        text-align: center;   
        height: 30px;     
    }
`  



export const ImageContainer = styled.button`
    margin-left: 30px;
    margin-top: 30px;
    margin-bottom: 30px;
    border:none;
    border-radius: 5%;
    background-color: #F5F5F5;
    
    &:hover{
        background-color: #FFFFFF;
        }
    &:active{
        background-color: #9381FF;
        }`



