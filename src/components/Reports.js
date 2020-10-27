import React, {useEffect, useState} from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import MUIDataTable from "mui-datatables";
import rest from "./Rest";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

export const Reports = ({setRoute}) => {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const statuses = [
        {name: 'UNAVAILABLE', color: 'grey'},
        {name: 'ADDED', color: 'green'},
        {name: 'DELETED', color: 'red'},
    ]

    useEffect(() => {

        setLoading(true)

        rest('crawls')
            .then(res => {

                setLoading(false)

                if (res.status === 200) {

                    setData(res.body)

                    // console.log(res.body)

                }

            })

    }, [])

    const assetsRender = value => value.length === 0
        ? 'not exists'
        : <List>
            {value.map(a => <ListItem key={"assetskeyfowqerg" + a.id}>
                {a.asset_name}
            </ListItem>)}
        </List>

    const customBodyRender = value => {

        if (value.length === 0) return 'N/A'

        return <List>
            {value.map(e => {

                let status = statuses[e.status_id]

                return <ListItem
                    key={"entrieskeyforcriwuerbkver" + e.id}
                    style={{
                        backgroundColor: status.color,
                        color: 'white',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    <ListItemText
                        primary={e.entry_name}
                        secondary={status.name + ", add: " + e.created_at + ", upd: " + e.updated_at}
                    />
                </ListItem>
            })}
        </List>

    }

    const columns = [
        {
            name: "publisher",
            label: "Publisher",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: "Domain",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "assets",
            label: "assets name",
            options: {
                filter: true,
                sort: true,
                customBodyRender: assetsRender
            }
        },
        {
            name: "app_ads",
            label: "app-ads.txt entries",
            options: {
                customBodyRender
            }
        },
        {
            name: "ads",
            label: "ads.txt entries",
            options: {
                customBodyRender
            }
        },
    ]

    const options = {
        selectableRows: 'none',
        confirmFilters: true,
    };

    return loading
        ? <LinearProgress/>
        : <>
            <IconButton onClick={() => setRoute('publishers')}>
                <ArrowBackIcon/>
            </IconButton>

            <Grid container
                  style={{padding: '1rem'}}
                  direction={"column"} alignItems={"center"}>

                <Grid item>
                    <MUIDataTable
                        title="Reports"
                        data={data}
                        columns={columns}
                        options={options}
                    />

                </Grid>
            </Grid>
        </>
}