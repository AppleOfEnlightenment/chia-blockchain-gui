import React, { useState, useMemo } from 'react';
import { Flex, LayoutDashboardSub, Loading, useTrans } from '@chia/core';
import { defineMessage } from '@lingui/macro';
import type { NFTInfo, Wallet } from '@chia/api';
import { useGetNFTWallets } from '@chia/api-react';
import { Grid } from '@mui/material';
// import NFTGallerySidebar from './NFTGallerySidebar';
import NFTCardLazy from '../NFTCardLazy';
import Search from './NFTGallerySearch';
import { NFTContextualActionTypes } from '../NFTContextualActions';
import type NFTSelection from '../../../types/NFTSelection';
import useFetchNFTs from '../../../hooks/useFetchNFTs';
import NFTProfileDropdown from '../NFTProfileDropdown';

function searchableNFTContent(nft: NFTInfo) {
  const items = [nft.$nftId, nft.dataUris?.join(' ') ?? '', nft.launcherId];

  return items.join(' ').toLowerCase();
}

export default function NFTGallery() {
  const { wallets: nftWallets, isLoading: isLoadingWallets } =
    useGetNFTWallets();
  const { nfts, isLoading: isLoadingNFTs } = useFetchNFTs(
    nftWallets.map((wallet: Wallet) => wallet.id),
  );
  const isLoading = isLoadingWallets || isLoadingNFTs;
  const [search, setSearch] = useState<string>('');
  const [walletId, setWalletId] = useState<number | undefined>();
  const t = useTrans();
  const [selection, setSelection] = useState<NFTSelection>({
    items: [],
  });

  const filteredData = useMemo(() => {
    if (!nfts) {
      return nfts;
    }

    return nfts.filter((nft) => {
      const { walletId } = nft;

      if (walletId !== undefined && nft.walletId !== walletId) {
        return false;
      }

      const content = searchableNFTContent(nft);
      if (search) {
        return content.includes(search.toLowerCase());
      }

      return true;
    });
  }, [search, walletId, nfts]);

  function handleSelect(nft: NFTInfo, selected: boolean) {
    setSelection((currentSelection) => {
      const { items } = currentSelection;

      return {
        items: selected
          ? [...items, nft]
          : items.filter((item) => item.$nftId !== nft.$nftId),
      };
    });
  }

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <LayoutDashboardSub
      // sidebar={<NFTGallerySidebar onWalletChange={setWalletId} />}
      header={
        <Flex gap={2} alignItems="center">
          <NFTProfileDropdown onChange={setWalletId} />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexGrow={1}
            gap={1}
          >
            <Search
              onChange={setSearch}
              value={search}
              placeholder={t(defineMessage({ message: `Search...` }))}
            />
            {/*
            <NFTContextualActions selection={selection} />
            */}
          </Flex>
        </Flex>
      }
    >
      <Grid spacing={2} alignItems="stretch" container>
        {filteredData?.map((nft: NFTInfo) => (
          <Grid xs={12} sm={6} md={4} lg={4} xl={3} key={nft.$nftId} item>
            <NFTCardLazy
              nft={nft}
              onSelect={(selected) => handleSelect(nft, selected)}
              selected={selection.items.some(
                (item) => item.$nftId === nft.$nftId,
              )}
              canExpandDetails={true}
              availableActions={NFTContextualActionTypes.All}
            />
          </Grid>
        ))}
      </Grid>
    </LayoutDashboardSub>
  );
}