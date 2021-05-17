import { useUser } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Router from "next/router";
import Head from "next/head";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import Button, { ButtonIcon } from "../components/Button";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import Loader from "../components/Loader";
import { LoadingWrapper } from "../shared/styles";
import styled from "@emotion/styled";

function LandingPage() {
  const { user, error, isLoading } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  // console.log(faunaUserData);

  if (user && faunaUserData) {
    if (faunaUserData.setupCompleted) {
      return Router.push(`/dashboard`);
    } else {
      return Router.push(`/onboarding`);
    }
  }

  return (
    <>
      <Head>
        <title>Welcome to pblsh!</title>
        <meta name="description" content="A new way to publish" />
      </Head>

      <PageWrapper>
        {(isLoading ||
          (faunaUserStatus !== "fetched" && faunaUserStatus !== "no_user")) && (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        )}

        {error && <div>{error.message}</div>}

        {!isLoading && !error && faunaUserStatus === "no_user" && (
          <HeroSection>
            <Left>
              <h1>Your new home for sharing</h1>
              <p>
                Welcome to pblsh&mdash;a simple, easy, fast solution for
                organizing and publishing content.
              </p>

              <Actions>
                <Button href="/api/auth/login">
                  Start Publishing
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
              </Actions>
            </Left>
          </HeroSection>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(LandingPage);

const PageWrapper = styled.main`
  margin: 5rem 0;
`;

const HeroSection = styled.section`
  margin: 0 5rem;

  h1 {
    font-size: 3rem;
  }

  p {
    margin-top: 1.25rem;
    font-size: 1.2em;
    font-weight: var(--font-weight-light);
  }
`;

const Left = styled.div`
  max-width: 500px;
`;

const Actions = styled.div`
  margin-top: 3rem;
`;
