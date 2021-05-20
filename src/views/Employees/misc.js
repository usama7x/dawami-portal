{
    empList.map((ele, index) => {
        return (
            <Card key={index} className={classes.root} style={{ width: "28%", margin: "20px", position: "relative" }}>

                <div className={classes.title}>
                    <TitleDiv empName={ele[2]} code={ele[3]} />
                    <dov>{ele[4]}</dov>
                </div>
                <CardMedia
                    className={classes.media}
                    image={ele[1]}
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