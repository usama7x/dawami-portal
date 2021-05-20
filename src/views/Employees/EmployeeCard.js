import React, { useEffect, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Lang from '../../variables/lang.json';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import CustomIconButton from '../Common/CustomIconButton';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PersonIcon from '@material-ui/icons/Person';
const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 3,
        slidesToSlide: 3,
        partialVisibilityGutter: 40
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3,
        partialVisibilityGutter: 40
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};
const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "250px"
    },
    media: {
        width: "35%",
        height: "250px",
        backgroundSize: "contain",
        backgroundColor: "#aba5a517",
        backgroundPosition: "center"
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    headColor: {
        color: "#a157b4"
    },
    positionRight: {
        position: "absolute",
        right: "0",
        bottom: "0"
    },
    empName: {
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "20px",
        fontWeight: "500",
        textTransform: "uppercase"

    },
    flexDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        padding: "0",
        paddingBottom: "16px"
    },
    address: {
        display: "inline-block",
        width: "85%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    rightSection: {
        width: "65%"
    }
}));
const TitleDiv = memo(({ empName, code }) => {
    const classes = useStyles();
    return (
        <div className={classes.flexDiv}>
            <Tooltip title={empName}>
                <span className={classes.empName}>{empName}</span>
            </Tooltip>
            <span>{code}</span>
        </div>
    )
})
const EmployeeCard = React.memo(function RecipeReviewCard({ empList, onDelete, closeLoader }) {
    // console.log("------->EmployeeCard");
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const empCarousal = () => {
        return (
            <Carousel responsive={responsive}>
                {
                    empList.map((ele, index) => {
                        return (
                            <Card key={index} className={classes.root} style={{ margin: "10px", position: "relative" }}>

                                <div className={classes.title}>
                                    <TitleDiv empName={ele[2]} code={ele[3]} />
                                    <dov>{ele[4]}</dov>
                                </div>
                                <CardMedia
                                    className={classes.media}
                                    image={ele[1] ? ele[1] : <PersonIcon fontSize="large" />}
                                    title={ele[2]}
                                />
                                <CardContent>
                                    <CustomIconButton className={classes.positionRight} icon="delete" title={Lang.deleteEmployee} onClick={() => onDelete(ele[0])} />
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <Typography style={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor} style={{ margin: "0" }}>Address:&nbsp;</Typography>
                                            <Tooltip title={ele[6]}>
                                                <span className={classes.address}>{ele[6]}</span>
                                            </Tooltip>
                                        </Typography>
                                        <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Email: </Typography>{ele[5]}</Typography>
                                        <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Hourly Rate: </Typography> {ele[8]}</Typography>
                                        <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Shift: </Typography> {ele[7]}</Typography>
                                        {/* <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>OTP Code: </Typography>{ele[3]}</Typography> */}
                                    </Typography>
                                </CardContent>
                            </Card>

                        )
                    })
                }
            </Carousel>
        );
    }
    useEffect(() => {
        // console.log("useEffect")
        closeLoader && closeLoader();
    }, [empList])
    return (
        empList.map((ele, index) => {
            return (
                <Card key={index} className={classes.root} style={{ margin: "10px", position: "relative" }}>
                    <CardMedia
                        className={classes.media}
                        image={ele[1] ? ele[1] : <PersonIcon fontSize="large" />}
                        title={ele[2]}
                    />
                    <div className={classes.rightSection}>
                        <CardContent>
                            <div className={classes.title}>
                                <TitleDiv empName={ele[2]} />
                                <div>{ele[3]}</div>
                            </div>
                            <CustomIconButton className={classes.positionRight} icon="delete" title={Lang.deleteEmployee} onClick={() => onDelete(ele[0])} />
                            <Typography variant="body2" color="textSecondary" component="p">
                                <Typography style={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor} style={{ margin: "0" }}>Address:&nbsp;</Typography>
                                    <Tooltip title={ele[6]}>
                                        <span className={classes.address}>{ele[6]}</span>
                                    </Tooltip>
                                </Typography>
                                <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Email: </Typography>{ele[5]}</Typography>
                                <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Contact Number: </Typography>{ele[4]}</Typography>
                                <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Hourly Rate: </Typography> {ele[8]}</Typography>
                                <Typography ><Typography variant="subtitle1" gutterBottom display="inline" className={classes.headColor}>Shift: </Typography> {ele[7]}</Typography>
                            </Typography>
                        </CardContent>
                    </div>
                </Card>

            )
        })
    )
});

export default EmployeeCard;