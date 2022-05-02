import Head from "next/head";
import Image from "next/image";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Nails by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
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
            Santeena's Shop
          </Typography>
          <Typography variant="body1" color="#fff">
            customise your look
          </Typography>
        </Grid>
        <Grid
          item
          container
          gap={4}
          paddingX={8}
          marginY={4}
          direction="row"
          justifyContent=""
        >
          {/* Product 1 */}
          <Card sx={{ maxWidth: 320 }}>
            <Image
              layout="responsive"
              width="320"
              height="400"
              src="https://dummyimage.com/630x810/ed407a/fff.jpg&text=product"
              alt="product placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Product 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tempor lorem.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Add to cart</Button>
            </CardActions>
          </Card>

          {/* Product 2 */}
          <Card sx={{ maxWidth: 320 }}>
            <Image
              layout="responsive"
              width="320"
              height="400"
              src="https://dummyimage.com/630x810/ed407a/fff.jpg&text=product"
              alt="product placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Product 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tempor lorem.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Add to cart</Button>
            </CardActions>
          </Card>

          {/* Product 3 */}
          <Card sx={{ maxWidth: 320 }}>
            <Image
              layout="responsive"
              width="320"
              height="400"
              src="https://dummyimage.com/630x810/ed407a/fff.jpg&text=product"
              alt="product placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Product 3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tempor lorem.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Add to cart</Button>
            </CardActions>
          </Card>

          {/* Product 4 */}
          <Card sx={{ maxWidth: 320 }}>
            <Image
              layout="responsive"
              width="320"
              height="400"
              src="https://dummyimage.com/630x810/ed407a/fff.jpg&text=product"
              alt="product placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Product 4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tempor lorem.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Add to cart</Button>
            </CardActions>
          </Card>

          {/* Product 5 */}
          <Card sx={{ maxWidth: 320 }}>
            <Image
              layout="responsive"
              width="320"
              height="400"
              src="https://dummyimage.com/630x810/ed407a/fff.jpg&text=product"
              alt="product placeholder"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Product 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tempor lorem.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Add to cart</Button>
            </CardActions>
          </Card>
        </Grid>
      </main>
    </div>
  );
}
