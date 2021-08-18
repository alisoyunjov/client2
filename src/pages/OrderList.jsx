import React, { Component, useState} from 'react'
import ReactTable, {useRowSelect} from "react-table-6"; 
import 'react-dropdown/style.css';
import "react-table-6/react-table.css" 
import download from 'downloadjs';
import axios from 'axios'; 
import "react-table-6/react-table.css" 
import api from '../components/api/index'
import userApi from '../components/api/userApi'
import dateFormat from 'dateformat';
import Tabs from './Tabs';
import styled from 'styled-components'
import { BorderBottom } from '@material-ui/icons';
import AuthService from "../services/authService";
import {CSVLink} from "react-csv";

import { API_URL } from './url';
const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
    margin-top: 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`
const Download = styled.div`
    color: #3f30cf;
    cursor: pointer;
`

class UpdateOrder extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/order/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>
        <button className="btn" id="button" style = {{backgroundColor: '#a88532'}}>Update</button>
        </Update>
    }
}

class DeleteOrder extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete this order permanently?`,
            )
        ) {
            api.deleteOrderById(this.props.id)
            
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>
        <button className="btn" id="button" style = {{backgroundColor: '#fc036f'}}>Delete</button>
        </Delete>
    }
}

class DownloadOrder extends Component {
    downloadOrder = async event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to download the order?`,
            )
        ) {
            if (this.props.numOfFiles == 1){
                const result =  await axios.get(`${API_URL}/downloadFiles/${this.props.id}`, {
                    responseType: 'blob'
                });
                const downloadName = `${Date.now()}.pdf`;
                download(result.data, downloadName, 'application/pdf');

            }
            else{
                const result =  await axios.get(`${API_URL}/download/${this.props.id}`, {
                    responseType: 'blob'
                });
                const downloadName = `${Date.now()}`;
                download(result.data, downloadName, 'application/octet-stream');
            }

        }
    }

    render() {
        if (this.props.numOfFiles == 0){        
            return <Delete >No File</Delete>
        }
        else{
            return <Download onClick={this.downloadOrder}>Download</Download>
        }
        
    }
}

const columns = [
    {
        Header: '',
        accessor: '',
        Cell: function(props) {
            return (
                <span>
                    <DeleteOrder id={props.original._id} />
                </span>
            )
        },
    },
    {
        Header: '',
        accessor: '',
        Cell: function(props) {
            return (
                <span>
                    <UpdateOrder id={props.original._id} />
                </span>
            )
        },
    },
    {
        Header: 'Price 1',
        accessor: 'price1',
        filterable: true,
        minWidth: 100,
    
    },
    {
        Header: 'Price 2',
        accessor: 'price2',
        filterable: true,
        minWidth: 100,
        

    },
    {
        Header: 'Milestone',
        accessor: 'milestone',
        filterable: true,
        minWidth: 120,
        
    },
    {
        Header: 'Submission',
        accessor: 'submission',
        filterable: true,
        minWidth: 120,
        
    },
    {
        Header: 'Requested Date',
        accessor: 'requestDay',
        filterable: true,
        minWidth: 140,
        Cell : (props)=>{
            var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const year = props.value.substring(0,4)
            const m = props.value.substring(5,7)
            const mm = parseInt(m)
            const month = strArray[mm-1]
            const day = props.value.substring(8,10)
            const d = month + ' ' + day +  ', ' + year  

            return <span>{d}</span>
        }
    },
    {
        Header: 'Needed By',
        accessor: 'date',
        filterable: true,
        minWidth: 140,
        Cell : (props)=>{
            if (props.value !== null){
                var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const year = props.value.substring(0,4)
                const m = props.value.substring(5,7)
                const mm = parseInt(m)
                const month = strArray[mm-1]
                const day = props.value.substring(8,10)
                const d = month + ' ' + day +  ', ' + year  

                return <span>{d}</span>
            }

        }
    },
    {
        Header: 'Vendor 1',
        accessor: 'vendor1',
        filterable: true,
        minWidth: 230,
    },

    {
        Header: 'Vendor 2',
        accessor: 'vendor2',
        filterable: true,
        minWidth: 230,
    },
    {
        Header: 'Category',
        accessor: 'category',
        filterable: true,
        minWidth: 150,
    },
    {
        Header: 'Catalog 1',
        accessor: 'catalog1',
        filterable: true,
        minWidth: 150,
    },
    {
        Header: 'Catalog 2',
        accessor: 'catalog2',
        filterable: true,
        minWidth: 150,
    },
    {
        Header: 'Item Amount',
        accessor: 'numberOfItems',
        filterable: true,
        minWidth: 120,
    },
    {
        Header: 'Item Description',
        accessor: 'description',
        filterable: true,
        minWidth: 200,
    },

    {
        Header: 'Notes',
        accessor: 'notes',
        filterable: true,
        minWidth: 250,
    },
    {
        Header: 'Status',
        accessor: 'orderStatus',
        filterable: true,
        minWidth: 150,
        Cell: (props) =>{
            var fileAttached;
            if (props.value === true) {
              fileAttached = 'Finished';
            }
            else{
              fileAttached = 'Not Finished';
            }
            return <span>{fileAttached}</span>
        }
    },
    {
        Header: 'Is File Needed',
        accessor: 'msdFile',
        filterable: true,
        minWidth: 150,
        Cell: (props) =>{
            var fileAttached;
            if (props.value === true) {
              fileAttached = 'Yes';
            }
            else{
              fileAttached = 'No';
            }
            return <span>{fileAttached}</span>
        }
    },

    {
        Header: 'Files',
        accessor: '',
        Cell: function(props) {
            return (
                <span>
                    <DownloadOrder id={props.original._id} numOfFiles = {props.original.numberOfFiles}/>
                </span>
            )
        },
    },
]
class OrdersList extends Component {
    constructor(props) {

        super(props)
        this.download = this.download.bind(this);
        this.reactTable = React.createRef();
        this.state = {
            orders: [],
            columns: [],
            isLoading: false,
            currentUser: AuthService.getCurrentUser(),
            dataToDownload: []
        }
        
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })
        const { currentUser } = this.state;
        await api.getOrdersbyPerson(currentUser.name).then(orders => {
                this.setState({
                orders: orders.data.data,
                isLoading: false,
            })
        })
    }
    getTrProps = (state, rowInfo, colInfo, instance) => {
          return {
            style: {
              background: '#e1eef2'
            }
          }
      }

    download(event) {
        const currentRecords = this.reactTable.getResolvedState().sortedData;
        var data_to_download = []
        for (var index = 0; index < currentRecords.length; index++) {
           let record_to_download = {}
           for(var colIndex = 0; colIndex < columns.length-3 ; colIndex ++) {
                if(colIndex == 3){
                    var date = currentRecords[index][columns[colIndex].accessor].toString().substring(0,10);
                    // window.alert(date)
                    record_to_download[columns[colIndex].Header] = date
                    // window.alert(record_to_download[columns[colIndex].Header])
                } 
                record_to_download[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
           }
           data_to_download.push(record_to_download)
        }
        this.setState({ dataToDownload: data_to_download }, () => {
           this.csvLink.link.click()
        })
      } 

    render() {
        const { orders, isLoading } = this.state
        const { currentUser } = this.state;
        const onChangeFct = () => console.log("onChange usually handled by redux");
        

        let showTable = true
        if (!orders.length) {
            showTable = false
        }

        return (
            <div>
            <div>
               <CSVLink
                   data={this.state.dataToDownload}
                   filename="data.csv"
                   className="hidden"
                   ref={(r) => this.csvLink = r}
                   target="_blank"/>

            </div>
            <div>
                <Wrapper>
                <button onClick={this.download} style= {{marginLeft: '40px'}, {float: 'left'}}>
                   Export CSV File
               </button>
                <h1 style = {{marginBottom: '30px'}}>{currentUser.name}'s Orders</h1>
                    { showTable && (
                        <ReactTable
                            ref={(r) => this.reactTable = r}
                            data={orders}
                            columns={columns}
                            loading={isLoading}
                            defaultPageSize={25}
                            showPageSizeOptions={true}
                            minRows={0}
                            getTrProps={this.getTrProps}
                        />
                    )}
                </Wrapper>
            </div>
            </div>
        )
    }
}

export default OrdersList

