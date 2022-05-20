import React from 'react';
import { Trans } from '@lingui/macro';
import type { NFTInfo } from '@chia/api';
import { Flex } from '@chia/core';
import { Box, Typography } from '@mui/material';
import NFTCard from '../nfts/NFTCard';

/* ========================================================================== */

type NFTOfferPreviewProps = {
  nft?: NFTInfo;
};

export default function NFTOfferPreview(props: NFTOfferPreviewProps) {
  const { nft } = props;
  const borderStyle = nft ? '2px solid #E0E0E0' : '2px dashed #E0E0E0';

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        width: '328px',
        height: '576px',
        borderLeft: '1px solid #E0E0E0',
      }}
      gap={1}
    >
      <Flex
        flexDirection="column"
        flexGrow={1}
        gap={1}
        style={{
          padding: '1.5rem',
        }}
      >
        <Typography variant="subtitle1">Preview</Typography>
        <Box
          sx={{
            width: '264px',
            height: '456px',
            boxSizing: 'border-box',
            border: `${borderStyle}`,
            borderRadius: '24px',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {!!nft ? (
            <NFTCard nft={nft} />
          ) : (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
              gap={1}
              style={{
                wordBreak: 'break-all',
              }}
            >
              <Typography variant="h6">
                <Trans>NFT not specified</Trans>
              </Typography>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}