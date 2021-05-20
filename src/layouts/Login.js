import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { setUserSession, setAppCache } from '../utils/Common.js';
import { config } from '../variables/general.js'
import Lang from '../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import api from '../variables/api.json';
// import api from '../'
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        {Lang.appName}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  //notification hooks
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("tr");
  const [color, setColor] = useState("info");
  const [error, setError] = useState(null);
    // handle button click of login form
    const handleLogin = (ev) => {
      ev.preventDefault();
      //validations
      if(!username.value || !password.value) {
        showNotification(Lang.loginPage.keyRequiredField);
        return false;
      }else if( /(.+)@(.+){2,}\.(.+){2,}/.test(username.value) !== true){
        showNotification(Lang.loginPage.keyInvalidEmail);
        return false;
      }else if(password.value.length < 6) {
        showNotification(Lang.loginPage.keyPasswordErrorMessage);
        return false;
      }

      setLoading(true);
      config.params = {};
      config.params.userName = username.value;
      config.params.password= password.value;
      axios.post(api.login, null, config).then(response => {
        setLoading(false);
        setUserSession(true, response.data);
        setAppCache('orgId', response.data.orgId);
        setAppCache('adminUserId', response.data.adminUserId)
        props.history.push('/dashboard');
      }).catch(error => {
        setLoading(false);
        if (error && error.response) showNotification(error.response.data.value);
        else showNotification(Lang.loginPage.keySomethingWentWrong);
      });
    }
  
  //notification handler
  const showNotification = (message) => {
    setError(message);
    setOpen(true);
    setTimeout(()=>{
      setOpen(false)
    },3000)
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField  
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...password}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Snackbar
        place={place}
        color={color}
        icon={AddAlert}
        message={error}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
    </Container>
    
  );
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}