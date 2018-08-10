import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

import Config from './Config'

import { Button, ButtonGroup } from 'react-bootstrap';
import loadgif from './load.gif'
//import MyTable from './MyTable'

/*
   get token
   let res = await axios.post('https://smarthealth.service.moph.go.th/phps/public/api/v3/gettoken', {
     username: 'xxxxx@gmail.com',
     password: 'xxxxxxxxx'
   })
   this.setState({      
     token : res.data.jwt_token
   })*/


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      'token': Config.token,
      'pic': null,
      'person_data': {},
      'loading': false,
      'apiGeneral': 'https://smarthealth.service.moph.go.th/phps/api/person/v2/findby/cid?cid=',
      'apiAddress': 'https://smarthealth.service.moph.go.th/phps/api/address/v1/find_by_cid?cid=',
      'apiDrug': 'https://smarthealth.service.moph.go.th/phps/api/drugallergy/v1/find_by_cid?cid=',

      'apiLinkNhso': 'https://smarthealth.service.moph.go.th/phps/api/00031/009/01', //สิทธิรักษา
      'apiLinkPerson': 'https://smarthealth.service.moph.go.th/phps/api/00023/001/01', //ทะเบียนราษ
      'apiLinkHome': 'https://smarthealth.service.moph.go.th/phps/api/00023/008/01', //ทะเบียนบ้าน
      'apiLinkAddress': 'https://smarthealth.service.moph.go.th/phps/api/00023/027/01', //ที่อยู่
    }


  }
  async componentDidMount() {
    let resp = await axios.get('http://localhost:8084/smartcard/data/');
    this.setState({
      cid: resp.data.cid,
      pic: 'http://localhost:8084/smartcard/picture/?h=' + Math.random()
    })
  }



  onChange = (e) => {
    this.setState({
      cid: e.target.value
    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.process2(this.state.apiGeneral)

  }

  process = async (api) => {
    this.setState({
      loading: true,
    })
    let resp;
    try {
      resp = await axios.get('http://localhost:8084/smartcard/data/')
    } catch (error) {
      console.log('err', error)
      return;
    }



    if (resp.data.cid) {
      this.setState({
        cid: resp.data.cid,
        pic: 'http://localhost:8084/smartcard/picture/?h=' + Math.random()
      })
    } else {
      alert('Error')
      window.location.reload();
      return;
    }



    let raw = await axios.get(api + resp.data.cid, {
      headers: {
        'jwt-token': this.state.token
      }
    });

    console.log(JSON.stringify(raw.data))
    this.setState({
      person_data: raw.data,
      loading: false
    })
  }

  process2 = async (api) => {

    this.setState({
      loading: true,
      pic: null
    })

    setTimeout(() => {

    })

    let raw = await axios.get(api + this.state.cid, {
      headers: {
        'jwt-token': this.state.token
      }
    });

    console.log(JSON.stringify(raw.data))
    this.setState({
      person_data: raw.data,
      loading: false
    })
  }

  generalClick = () => {
    this.process(this.state.apiGeneral)
  }

  addressClick = () => {
    this.process(this.state.apiAddress)
  }

  drugClick = () => {
    this.process(this.state.apiDrug)
  }

  linkAge = async (api) => {
    this.setState({
      loading: true
    })

    let resp = await axios.post(api, this.state.cid, {
      headers: {
        'jwt-token': this.state.token
      },
    });
    console.log('link', JSON.stringify(resp.data))

    if (resp.data) {
      this.setState({
        person_data: resp.data,
        loading: false
      })
    }

  }


  render() {
    return (
      <div className="App">

        <h1 className="App-title">ระบบตรวจสอบข้อมูลรายบุคคล (SmartHealthId)  สสจ.พิษณุโลก</h1>
        <div>กดปุ่มเมื่อไฟเครื่องอ่านหยุดกระพริบ</div>
        <div style={{ padding: 10 }}>
          <ButtonGroup>
            <Button bsSize="large" onClick={this.generalClick} >Moph-ทั่วไป </Button>
            <Button bsSize="large" onClick={this.addressClick} > Moph-ที่อยู่ </Button>
            <Button bsSize="large" onClick={this.drugClick} > Moph-แพ้ยา </Button>

            <Button bsSize='large' onClick={() => this.linkAge(this.state.apiLinkNhso)}>Dopa-สิทธิรักษา</Button>
            <Button bsSize='large' onClick={() => this.linkAge(this.state.apiLinkPerson)}>Dopa-ทะเบียนราษ</Button>
            <Button bsSize='large' onClick={() => this.linkAge(this.state.apiLinkHome)}>Dopa-ทะเบียนบ้าน</Button>
            <Button bsSize='large' onClick={() => this.linkAge(this.state.apiLinkAddress)}>Dopa-ที่อยู่</Button>
          </ButtonGroup>

          <div style={{ marginTop: 5 }}>
            <form onSubmit={this.onSubmit}>

            </form>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          {!this.state.loading ? <div>
            <div>
              <img width={100} height={100} src={this.state.pic} />
            </div>
            <div>

              <JSONPretty id="json-pretty" json={this.state.person_data}></JSONPretty>
            </div>
          </div> : <div><img src={loadgif} /></div>}
        </div>


      </div>
    );
  }
}

export default App;
