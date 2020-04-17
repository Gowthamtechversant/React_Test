import './App.css';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
class Home extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          page: 0,
          rowsPerPage:5,
          rawJson : '',
        };
        this.counter = 0;
        this.call();
        setInterval(this.call, 10000);
      }

     call =()=>{
      let url = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&page='+this.counter;
      this.counter++;
        axios.get(url).then(res =>{
          if(res.status === 200){
        let prevArray = this.state.data;
        let temp = res.data.hits.map((iter, index)=>{
        return this.createData(iter, index);
        });
        let finalData=prevArray.concat(temp);
        this.setState({data:finalData});
      }
      });
    }
    
    createData(data, index) {
      return { id:index, title:data.title, url:data.url, created_at:data.created_at, author:data.author };
    }

    tablePaginationActions=(props) =>{
      const classes = makeStyles((theme) => ({
        root: {
          flexShrink: 0,
          marginLeft: theme.spacing(2.5),
        },
      }));

      const theme = useTheme();
      const { count, page, rowsPerPage, onChangePage } = props;
    
      const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
      };
    
      const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
      };
    
      const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
      };
    
      const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      };
    
      return (
        <div className={classes.root}>
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
          >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
          >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </div>
      );
    }
  click =(id)=>{
   this.setState({rawJson:JSON.stringify(this.state.data[id])});
  }

    render() {
      const classes = makeStyles({
        table: {
          minWidth: 500,
        },
      });

  const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.data.length - this.state.page * this.state.rowsPerPage);

  const handleChangePage = (event, newPage) => {
    this.setState({page:newPage});
  };

  const handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage:parseInt(event.target.value, 10),page:0 });
  };
  if(this.state.rawJson === '')
  {
    return(
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
        <TableRow key='#'>
              <TableCell component="th" scope="row">
                Title
              </TableCell>
              <TableCell component="th" scope="row">
                URL
              </TableCell>
              <TableCell component="th" scope="row">
               Author
              </TableCell>
              <TableCell component="th" scope="row">
               Created At
              </TableCell>
            </TableRow>
          {(this.state.rowsPerPage > 0
            ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
            : this.state.data
          ).map((row) => (
            <TableRow key={row.id} onClick={()=>{this.click(row.id)}}>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.url}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.author}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.created_at}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={this.state.data.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={this.tablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    );
            }
    else
    {
      return (<div>
        <h4 onClick={()=>{this.setState({rawJson:''});}}>Back</h4>
        <p> {this.state.rawJson} </p></div>);
    }
}
  }

export default Home;
