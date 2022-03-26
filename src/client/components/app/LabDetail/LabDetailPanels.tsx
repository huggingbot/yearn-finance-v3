import { useContext } from 'react';
import styled from 'styled-components';

import { formatApy, USDC_DECIMALS, humanize } from '@utils';
import { AppContext } from '@context';
import { useAppTranslation } from '@hooks';
import { device } from '@themes/default';
import { TokenIcon, ScanNetworkIcon, ApyTooltipData } from '@components/app';
import {
  Card,
  CardContent,
  CardHeader,
  Text,
  Markdown,
  Icon,
  InfoIcon,
  AddCircleIcon,
  Tooltip,
} from '@components/common';
import { MetamaskLogo } from '@assets/images';
import { GeneralLabView, Network } from '@types';

const StyledCardContent = styled(CardContent)`
  margin-top: 0.4rem;
`;

const StyledCardHeader = styled(CardHeader)`
  padding: 0;
`;

const StyledCardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-items: between;
`;

const StyledImg = styled.img`
  object-fit: cover;
  width: 30px;
  height: 30px;
`;

const RelativeContainer = styled.span`
  cursor: pointer;
  position: relative;
`;

const IconOverImage = styled(Icon)`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 100%;
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
`;

const OverviewInfo = styled(Card)`
  padding: ${({ theme }) => theme.card.padding};
  flex-shrink: 0;

  a {
    text-decoration: underline;
    color: inherit;
    color: ${({ theme }) => theme.colors.onSurfaceSH1};
  }
`;

const StyledText = styled(Text)`
  display: block;
  color: ${(props) => props.theme.colors.secondary};
  white-space: initial;
`;

const StyledLink = styled.a`
  display: block;
  text-decoration: underline;
  color: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const InfoValueRow = styled.div`
  display: grid;
  grid-template-columns: 9.6rem 1fr;
  grid-gap: 0.6rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.onSurfaceSH1};
  font-size: 1.4rem;
  align-items: center;

  > * {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const TextWithIcon = styled.div`
  display: flex;
  align-items: center;

  ${StyledText} {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 10rem;
  }
`;

const StyledIcon = styled(Icon)`
  margin-left: 1rem;
  flex-shrink: 0;
`;

const InfoValueTitle = styled(Text)`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: ${(props) => props.theme.colors.secondary};
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TokenLogo = styled(Card)`
  padding: 2.2rem;
  height: min-content;
`;

const OverviewTokenInfo = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 4.7rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.layoutPadding};
`;

const LabOverview = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  max-width: 100%;

  > div:not(:first-child) {
    margin-top: ${({ theme }) => theme.card.padding};
  }

  @media ${device.mobile} {
    ${OverviewTokenInfo} {
      grid-gap: 2rem;
    }
    ${InfoValueRow} {
      display: flex;
      margin-top: 0.5rem;
      flex-direction: column;
    }
  }

  @media (max-width: 360px) {
    ${OverviewTokenInfo} {
      display: flex;
      flex-direction: column;
    }
  }
`;

export interface LabDetailPanelsProps {
  selectedLab: GeneralLabView;
  displayAddToken?: boolean;
  currentNetwork?: Network;
  blockExplorerUrl?: string;
}

const getTooltip = ({ apyMetadata, address }: Pick<GeneralLabView, 'apyMetadata' | 'address'>) => {
  if (!apyMetadata) {
    return null;
  }

  return (
    <Tooltip placement="bottom" tooltipComponent={<ApyTooltipData apy={apyMetadata} address={address} />}>
      <StyledIcon Component={InfoIcon} size="1.5rem" />
    </Tooltip>
  );
};

export const LabDetailPanels = ({
  selectedLab,
  displayAddToken,
  currentNetwork,
  blockExplorerUrl,
}: LabDetailPanelsProps) => {
  const { t } = useAppTranslation('labdetails');

  const context = useContext(AppContext);

  const handleAddToken = () => {
    const {
      address,
      decimals,
      displayIcon,
      token: { symbol },
    } = selectedLab;

    if (context?.wallet.addToken) {
      context?.wallet.addToken(address, symbol.substring(0, 11), Number(decimals), displayIcon || '');
    }
  };

  return (
    <>
      <Row>
        <LabOverview>
          <StyledCardHeaderContainer>
            <StyledCardHeader header={t('labdetails:overview-panel.header')} />
            {displayAddToken ? (
              <RelativeContainer onClick={handleAddToken}>
                <StyledImg src={MetamaskLogo} />
                <IconOverImage Component={AddCircleIcon} />
              </RelativeContainer>
            ) : null}
            <ScanNetworkIcon
              currentNetwork={currentNetwork}
              blockExplorerUrl={blockExplorerUrl}
              address={selectedLab.address}
            />
          </StyledCardHeaderContainer>

          <OverviewTokenInfo>
            <TokenLogo variant="background">
              <TokenIcon icon={selectedLab.displayIcon} symbol={selectedLab.displayName} size="xBig" />
            </TokenLogo>

            <TokenInfo>
              <InfoValueTitle>{selectedLab?.displayName}</InfoValueTitle>

              <InfoValueRow>
                <span>{t('labdetails:overview-panel.apy')}</span>
                <TextWithIcon>
                  <StyledText fontWeight="bold">
                    <span>{formatApy(selectedLab.apyData)}</span>
                  </StyledText>
                  {getTooltip({
                    apyMetadata: selectedLab.apyMetadata,
                    address: selectedLab.address,
                  })}
                </TextWithIcon>
              </InfoValueRow>
              <InfoValueRow>
                <span>{t('labdetails:overview-panel.total-assets')}</span>
                <StyledText>{humanize('usd', selectedLab.labBalanceUsdc, USDC_DECIMALS, 0)}</StyledText>
              </InfoValueRow>
              <InfoValueRow>
                <span>{t('labdetails:overview-panel.type')}</span>
                <StyledText>{selectedLab.token.categories}</StyledText>
              </InfoValueRow>
              <InfoValueRow>
                <span>{t('labdetails:overview-panel.web')}</span>
                <StyledLink href={selectedLab.token.website}>{selectedLab.token.website}</StyledLink>
              </InfoValueRow>
            </TokenInfo>
          </OverviewTokenInfo>

          <StyledCardHeader header={t('labdetails:overview-panel.about')} />

          {selectedLab.token.description && (
            <OverviewInfo variant="surface" cardSize="micro">
              <StyledCardContent>
                <Markdown>{selectedLab.token.description}</Markdown>
              </StyledCardContent>
            </OverviewInfo>
          )}
        </LabOverview>
      </Row>
    </>
  );
};
