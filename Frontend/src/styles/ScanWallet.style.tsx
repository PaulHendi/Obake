import styled from "styled-components";


export const ScanWalletContainer = styled.div`

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    //justify-content: center;
    margin-top: 100px;
    margin-bottom: 100px;
    margin-left: 100px;
    margin-right: 100px;
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);

    img{
        width: 200px;
        height: 200px;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    h1{
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;

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


