import { Grid, Link, Typography } from "@mui/material";
import * as xLink from "next/link";

export const Header = () => (
  <Grid
    item
    container
    xs={12}
    direction="column"
    alignContent="center"
    bgcolor="primary.main"
    padding={10}
    spacing={2}
  >
    <Typography variant="h3" color="#fff">
      <xLink.default href="/" passHref={true}>
        <Link color="#fff">Santeena's Shop</Link>
      </xLink.default>
    </Typography>
    <Typography variant="body1" color="#fff">
      customise your look
    </Typography>
  </Grid>
);
