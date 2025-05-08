// import service from "./axios";
import { GET, POST } from './axios'

const http = {
  login: params => POST(
    `${import.meta.env.VITE_API_URL}/login`,
    params,
  ),

  send_code: params => POST(
    `${import.meta.env.VITE_API_URL}/send_code`,
    params,
  ),

  register: params => POST(
    `${import.meta.env.VITE_API_URL}/register`,
    params,
  ),

  update_password: params => POST(
    `${import.meta.env.VITE_API_URL}/user/update_password`,
    params,
    true,
  ),

  globalinfo: params => GET(
    `${import.meta.env.VITE_API_URL}/global/info`,
    params,
  ),

  userbalance: params => POST(
    `${import.meta.env.VITE_API_URL}/user/balance`,
    params,
  ),

  marketindex: params => GET(
    `${import.meta.env.VITE_API_URL}/market/index`,
    params,
  ),

  globalmarket: params => GET(
    `${import.meta.env.VITE_API_URL}/global/market`,
    params,
  ),

  userinfo: params => GET(
    `${import.meta.env.VITE_API_URL}/user/info`,
    params,
  ),

  userupload_image: params => POST(
    `${import.meta.env.VITE_API_URL}/user/upload_image`,
    params,
  ),

  userkyc: params => POST(
    `${import.meta.env.VITE_API_URL}/user/kyc`,
    params,
    true,
  ),

  swapcreate: params => POST(
    `${import.meta.env.VITE_API_URL}/swap/create`,
    params,
    true,
  ),

  swapcancel: params => POST(
    `${import.meta.env.VITE_API_URL}/swap/cancel`,
    params,
  ),

  swaporder: params => GET(
    `${import.meta.env.VITE_API_URL}/swap/order`,
    params,
  ),

  optionconfig: params => GET(
    `${import.meta.env.VITE_API_URL}/option/config`,
    params,
  ),

  optionorder: params => GET(
    `${import.meta.env.VITE_API_URL}/option/order`,
    params,
  ),

  optioncreate: params => POST(
    `${import.meta.env.VITE_API_URL}/option/create`,
    params,
  ),

  optionorder_info: params => GET(
    `${import.meta.env.VITE_API_URL}/option/order_info`,
    params,
  ),

  marketkline: params => GET(
    `${import.meta.env.VITE_API_URL}/market/kline`,
    params,
  ),

  billingrecharge_info: params => GET(
    `${import.meta.env.VITE_API_URL}/billing/recharge_info`,
    params,
  ),

  billingwithdraw_info: params => GET(
    `${import.meta.env.VITE_API_URL}/billing/withdraw_info`,
    params,
  ),

  useradd_wallet: params => POST(
    `${import.meta.env.VITE_API_URL}/user/add_wallet`,
    params,
    true,
  ),

  userdelete_wallet: params => POST(
    `${import.meta.env.VITE_API_URL}/user/delete_wallet`,
    params,
    true,
  ),

  userwallet: params => GET(
    `${import.meta.env.VITE_API_URL}/user/wallet`,
    params,
  ),

  billingwithdraw: params => POST(
    `${import.meta.env.VITE_API_URL}/billing/withdraw`,
    params,
    true,
  ),

  billingrecharge_record: params => GET(
    `${import.meta.env.VITE_API_URL}/billing/recharge_record`,
    params,
  ),

  billingwithdraw_record: params => GET(
    `${import.meta.env.VITE_API_URL}/billing/withdraw_record`,
    params,
  ),

  userget_conversion: params => GET(
    `${import.meta.env.VITE_API_URL}/user/get_conversion`,
    params,
  ),

  userconversion: params => POST(
    `${import.meta.env.VITE_API_URL}/user/conversion`,
    params,
    true,
  ),
  marketdepth: params => GET(
    `${import.meta.env.VITE_API_URL}/market/depth`,
    params,
  ),

  issuelist: params => GET(
    `${import.meta.env.VITE_API_URL}/issue/list`,
    params,
  ),
  issueorder: params => GET(
    `${import.meta.env.VITE_API_URL}/issue/order`,
    params,
  ),
  issueshow: params => GET(
    `${import.meta.env.VITE_API_URL}/issue/show/${params}`,
  ),
  issuebuy: params => POST(
    `${import.meta.env.VITE_API_URL}/issue/buy`,
    params,
    true,
  ),
  globalHelp: params => GET(
    `${import.meta.env.VITE_API_URL}/global/help`,
    params,
  ),
  customerService: params => GET(
    `${import.meta.env.VITE_API_URL}/user/customer_service`,
    params,
  ),
}
export default http
