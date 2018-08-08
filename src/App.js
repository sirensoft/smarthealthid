import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import JSONPretty from 'react-json-pretty';

/*
   get token
   let res = await axios.post('https://smarthealth.service.moph.go.th/phps/public/api/v3/gettoken', {
     username: 'tehnnn@gmail.com',
     password: 'qazwsxedcr112233'
   })
   this.setState({      
     token : res.data.jwt_token
   })*/


class App extends Component {


  state = {
    'token': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZWhubm5AZ21haWwuY29tIiwiaWF0IjoxNTMzNzAwMTE0LCJleHAiOjE1MzM3NDc1OTl9.fS72iTl1GnMTlO8jHsEGcVRU6ulTzyye5lYOzaDp83I',
    'pic': null,
    'person_data': null,
    'loading': false,
    'apiGeneral': 'https://smarthealth.service.moph.go.th/phps/api/person/v2/findby/cid?cid=',
    'apiAddress': 'https://smarthealth.service.moph.go.th/phps/api/address/v1/find_by_cid?cid=',
    'apiDrug': 'https://smarthealth.service.moph.go.th/phps/api/drugallergy/v1/find_by_cid?cid=',
  }

  onChange = (e) => {
    this.setState({
      cid: e.target.value
    })
  }

  process = async (api) => {
    this.setState({
      loading: true
    })

    let resp = await axios.get('http://localhost:8084/smartcard/data/')

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

  generalClick = () => {
    this.process(this.state.apiGeneral)
  }

  addressClick = () => {
    this.process(this.state.apiAddress)
  }

  drugClick = () => {
    this.process(this.state.apiDrug)
  }

  render() {
    return (
      <div className="App">

        <h1 className="App-title">SmartHealthId สสจ.พิษณุโลก</h1>
        <div>กดปุ่มเมื่อไฟเครื่องอ่านหยุดกระพริบ</div>
        <button onClick={this.generalClick} > ทั่วไป </button>
        <button onClick={this.addressClick} > ที่อยู่ </button>
        <button onClick={this.drugClick} > แพ้ยา </button>
        <div style={{ marginTop: 10 }}>
          {!this.state.loading ? <div>
            <div>
              <img width={100} height={100} src={this.state.pic} />
            </div>
            <div>
              <JSONPretty id="json-pretty" json={this.state.person_data}></JSONPretty>
            </div>
          </div> : <div>Loading...</div>}
        </div>


      </div>
    );
  }
}

export default App;
