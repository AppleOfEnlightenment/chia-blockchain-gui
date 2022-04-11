import React, { useMemo, useState } from 'react';
import { Plural, Trans } from '@lingui/macro';
import styled from 'styled-components';
import {
  Button,
  ButtonLoading,
  ConfirmDialog,
  Fee,
  Form,
  FormatLargeNumber,
  Flex,
  TextField,
  TooltipIcon,
  chiaToMojo,
  useCurrencyCode,
  useOpenDialog,
} from '@chia/core';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';

// Temporary: Used by getFakeNFTName
import seedrandom from 'seedrandom';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

/* ========================================================================== */
/*                                   Styles                                   */
/* ========================================================================== */

const StyledTitle = styled(Box)`
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.7);
`;

const StyledValue = styled(Box)`
  word-break: break-all;
`;

/* ========================================================================== */
/*                              NFTTransferResult                             */
/* ========================================================================== */

export type NFTTransferResult = {
  success: boolean;
  transferInfo?: {
    nftAssetId: string;
    destinationDID: string;
    destinationInnerPH: string;
    fee: string;
  };
  error?: string;
};

/* ========================================================================== */
/*                      NFT Transfer Confirmation Dialog                      */
/* ========================================================================== */

type NFTTransferConfirmationDialogProps = NFTTransferFormData & {
  open: boolean; // For use in openDialog()
};

function NFTTransferConfirmationDialog(
  props: NFTTransferConfirmationDialogProps,
) {
  const { destinationDID, destinationInnerPH, fee, ...rest } = props;
  const feeInMojos = chiaToMojo(fee || 0);
  const currencyCode = useCurrencyCode();

  return (
    <ConfirmDialog
      title={<Trans>Confirm NFT Transfer</Trans>}
      confirmTitle={<Trans>Transfer</Trans>}
      confirmColor="secondary"
      cancelTitle={<Trans>Cancel</Trans>}
      {...rest}
    >
      <Flex flexDirection="column" gap={3}>
        <Typography variant="body1">
          <Trans>
            Once you initiate this transfer, you will not be able to cancel the
            transaction. Are you sure you want to transfer the NFT?
          </Trans>
        </Typography>
        <Divider />
        <Flex flexDirection="column" gap={1}>
          <Flex flexDirection="row" gap={1}>
            <Typography variant="body1">
              <Trans>Destination:</Trans>
            </Typography>
            <Typography variant="body1">{destinationDID}</Typography>
          </Flex>
          <Flex flexDirection="row" gap={1}>
            <Typography variant="body1">
              <Trans>Destination Inner Puzzle Hash:</Trans>
            </Typography>
            <Typography variant="body1">{destinationInnerPH}</Typography>
          </Flex>
          <Flex flexDirection="row" gap={1}>
            <Typography variant="body1">Fee:</Typography>
            <Typography variant="body1">
              {fee || '0'} {currencyCode}
            </Typography>
            {feeInMojos > 0 && (
              <>
                (
                <FormatLargeNumber value={feeInMojos} />
                <Box>
                  <Plural
                    value={feeInMojos.toNumber()}
                    one="mojo"
                    other="mojos"
                  />
                </Box>
                )
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </ConfirmDialog>
  );
}

NFTTransferConfirmationDialog.defaultProps = {
  open: false,
};

/* ========================================================================== */
/*                         NFT Transfer Action (Form)                         */
/* ========================================================================== */

type NFTTransferFormData = {
  destinationDID: string;
  destinationInnerPH: string;
  fee: string;
};

type NFTTransferActionProps = {
  nftAssetId: string;
  nftName: string;
  destinationDID?: string;
  destinationInnerPH?: string;
  onComplete?: (result?: NFTTransferResult) => void;
};

export default function NFTTransferAction(props: NFTTransferActionProps) {
  const {
    nftAssetId,
    nftName,
    destinationDID,
    destinationInnerPH,
    onComplete,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const openDialog = useOpenDialog();
  const methods = useForm<NFTTransferFormData>({
    shouldUnregister: false,
    defaultValues: {
      destinationDID: destinationDID || '',
      destinationInnerPH: destinationInnerPH || '',
      fee: '',
    },
  });

  async function handleClose() {
    if (onComplete) {
      onComplete(); // No result provided if the user cancels out of the dialog
    }
  }

  async function handleSubmit(formData: NFTTransferFormData) {
    const { destinationDID, destinationInnerPH, fee } = formData;
    let isValid = true;
    let confirmation = false;
    console.log('handleSubmit called in NFTTransferAction');
    console.log(formData);

    if (isValid) {
      confirmation = await openDialog(
        <NFTTransferConfirmationDialog
          destinationDID={destinationDID}
          destinationInnerPH={destinationInnerPH}
          fee={fee}
        />,
      );
    }

    if (confirmation) {
      setIsLoading(true);

      // TODO: Swap this out with a real NFT transfer call
      const success: boolean = await new Promise(
        (resolve) => setTimeout(() => resolve(true), 5000), // simulate success
        // setTimeout(() => resolve(false), 5000),  // simulate failure
      );
      const errorMessage = 'Placeholder: Generic failure message';

      setIsLoading(false);

      if (onComplete) {
        onComplete({
          success,
          transferInfo: {
            nftAssetId,
            destinationDID,
            destinationInnerPH,
            fee,
          },
          error: success ? undefined : errorMessage,
        });
      }
    }
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <Flex flexDirection="column" gap={3}>
        <Flex flexDirection="column" gap={1}>
          <Flex flexDirection="row" gap={1}>
            <Flex flexShrink={0}>
              <Typography variant="body1">
                <Trans>NFT Name:</Trans>
              </Typography>
            </Flex>
            <Flex
              flexDirection="row"
              alignItems="center"
              gap={1}
              sx={{ overflow: 'hidden' }}
            >
              <Typography noWrap variant="body1">
                {nftName}
              </Typography>
              <TooltipIcon interactive>
                <Flex flexDirection="column" gap={1}>
                  <StyledTitle>
                    <Trans>NFT Name</Trans>
                  </StyledTitle>
                  <StyledValue>
                    <Typography variant="caption">{nftName}</Typography>
                  </StyledValue>
                </Flex>
              </TooltipIcon>
            </Flex>
          </Flex>
          <Flex flexDirection="row" gap={1}>
            <Flex flexShrink={0}>
              <Typography variant="body1">
                <Trans>Asset ID:</Trans>
              </Typography>
            </Flex>
            <Flex
              flexDirection="row"
              alignItems="center"
              gap={1}
              sx={{ overflow: 'hidden' }}
            >
              <Typography noWrap variant="body1">
                {nftAssetId}
              </Typography>
              <TooltipIcon interactive>
                <Flex flexDirection="column" gap={1}>
                  <StyledTitle>
                    <Trans>NFT Asset ID</Trans>
                  </StyledTitle>
                  <StyledValue>
                    <Typography variant="caption">{nftAssetId}</Typography>
                  </StyledValue>
                </Flex>
              </TooltipIcon>
            </Flex>
          </Flex>
        </Flex>
        <TextField
          name="destinationDID"
          variant="filled"
          color="secondary"
          fullWidth
          label={<Trans>Send to Address</Trans>}
          disabled={isLoading}
          required
        />
        <TextField
          name="destinationInnerPH"
          variant="filled"
          color="secondary"
          fullWidth
          label={<Trans>Destination DID Inner Puzzle Hash</Trans>}
          disabled={isLoading}
          required
        />
        <Fee
          id="filled-secondary"
          variant="filled"
          name="fee"
          color="secondary"
          label={<Trans>Fee</Trans>}
          disabled={isLoading}
        />
        <DialogActions>
          <Flex flexDirection="row" gap={3}>
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              autoFocus
            >
              <Trans>Close</Trans>
            </Button>
            <ButtonLoading
              type="submit"
              autoFocus
              color="primary"
              variant="contained"
              loading={isLoading}
            >
              <Trans>Transfer</Trans>
            </ButtonLoading>
          </Flex>
        </DialogActions>
      </Flex>
    </Form>
  );
}

/* ========================================================================== */
/*                             NFT Transfer Dialog                            */
/* ========================================================================== */

type NFTTransferDialogProps = {
  open: boolean;
  onClose: (value: any) => void;
  onComplete?: (result?: NFTTransferResult) => void;
  nftAssetId: string;
  destinationDID?: string;
};

export function NFTTransferDialog(props: NFTTransferDialogProps) {
  const { open, onClose, onComplete, nftAssetId, destinationDID, ...rest } =
    props;

  const nftFakeName = useMemo(() => {
    return getFakeNFTName(nftAssetId);
  }, [nftAssetId]);

  function handleClose() {
    console.log('handleClose called in NFTTransferDialog');
    onClose(false);
  }

  function handleCompletion(result?: NFTTransferResult) {
    console.log('handleCompletion called in NFTTransferDialog');
    onClose(true);
    if (onComplete) {
      onComplete(result);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="nft-transfer-dialog-title"
      aria-describedby="nft-transfer-dialog-description"
      maxWidth="sm"
      fullWidth
      {...rest}
    >
      <DialogTitle id="nft-transfer-dialog-title">
        <Flex flexDirection="row" gap={1}>
          <Typography variant="h6">
            <Trans>Transfer NFT</Trans>
          </Typography>
        </Flex>
      </DialogTitle>
      <DialogContent>
        <Flex flexDirection="column" gap={3}>
          <DialogContentText id="nft-transfer-dialog-description">
            <Trans>
              Would you like to transfer the specified NFT to a new owner? It is
              recommended that you include a fee to ensure that the transaction
              is completed in a timely manner.
            </Trans>
          </DialogContentText>
          <NFTTransferAction
            nftAssetId={nftAssetId}
            nftName={nftFakeName}
            destinationDID={destinationDID}
            onComplete={handleCompletion}
          />
        </Flex>
      </DialogContent>
    </Dialog>
  );
}

NFTTransferDialog.defaultProps = {
  open: false,
  onClose: () => {},
};

/* ========================================================================== */
/*                              Utility Functions                             */
/* ========================================================================== */

const uniqueNames: {
  [key: string]: string;
} = {};

function getFakeNFTName(seed: string, iteration = 0): string {
  const computedName = Object.keys(uniqueNames).find(
    (key) => uniqueNames[key] === seed,
  );
  if (computedName) {
    return computedName;
  }

  const generator = seedrandom(iteration ? `${seed}-${iteration}` : seed);

  const uniqueName = uniqueNamesGenerator({
    dictionaries: [colors, animals, adjectives],
    length: 2,
    seed: generator.int32(),
    separator: ' ',
    style: 'capital',
  });

  if (uniqueNames[uniqueName] && uniqueNames[uniqueName] !== seed) {
    return getFakeNFTName(seed, iteration + 1);
  }

  uniqueNames[uniqueName] = seed;

  return uniqueName;
}
