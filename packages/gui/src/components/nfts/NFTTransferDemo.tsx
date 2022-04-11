import React from 'react';
import { Trans } from '@lingui/macro';
import { AlertDialog, Flex, Form, TextField, useOpenDialog } from '@chia/core';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { NFTTransferDialog, NFTTransferResult } from './NFTTransferAction';

type NFTTransferDemoFormData = {
  nftAssetId: string;
  destinationDID?: string;
};

export default function NFTTransferDemo() {
  const openDialog = useOpenDialog();
  const methods = useForm<NFTTransferDemoFormData>({
    shouldUnregister: false,
    defaultValues: {
      nftAssetId: '',
      destinationDID: '',
    },
  });

  function handleComplete(result?: NFTTransferResult) {
    console.log('handleComplete called in NFTTransferDemo');
    console.log(result);

    if (result) {
      if (result.success) {
        openDialog(
          <AlertDialog title={<Trans>NFT Transfer Complete</Trans>}>
            <Trans>
              The NFT transfer transaction has been successfully submitted to
              the blockchain.
            </Trans>
          </AlertDialog>,
        );
      } else {
        const error = result.error || 'Unknown error';
        openDialog(
          <AlertDialog title={<Trans>NFT Transfer Failed</Trans>}>
            <Trans>The NFT transfer failed: {error}</Trans>
          </AlertDialog>,
        );
      }
    }
  }

  async function handleInitiateTransfer(formData: NFTTransferDemoFormData) {
    const { nftAssetId, destinationDID } = formData;
    console.log('handleInitiateTransfer called in NFTs');
    console.log(formData);

    const result = await openDialog(
      <NFTTransferDialog
        nftAssetId={nftAssetId}
        destinationDID={destinationDID}
        onComplete={handleComplete}
      />,
    );
  }

  return (
    <Flex flexDirection="row" flexGrow={1} gap={3} style={{ padding: '1rem' }}>
      <Flex flexDirection="column" flexGrow={1} gap={3}>
        <Form methods={methods} onSubmit={handleInitiateTransfer}>
          <Flex flexDirection="column" gap={3}>
            <TextField
              name="nftAssetId"
              variant="outlined"
              label="NFT Coin Info"
              required
              fullWidth
            />
            <TextField
              name="destinationDID"
              variant="outlined"
              label="Destination DID Address (optional)"
              fullWidth
            />
            <Flex justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                <Trans>Transfer NFT</Trans>
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
}
