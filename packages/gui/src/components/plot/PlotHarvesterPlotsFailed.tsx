import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { TableControlled } from '@chia/core';
import { type Plot } from '@chia/api';
import { useGetHarvesterPlotsInvalidQuery, useGetHarvesterQuery } from '@chia/api-react';
import { Typography } from '@mui/material';
import PlotAction from './PlotAction';

const cols = [
  {
    field: 'filename',
    tooltip: 'filename',
    title: <Trans>Filename</Trans>,
  },
  {
    width: '150px',
    field: (plot: Plot) => <PlotAction plot={plot} />,
    title: <Trans>Action</Trans>,
  },
];

export type PlotHarvesterPlotsFailedProps = {
  peerId: string;
};

export default function PlotHarvesterPlotsFailed(props: PlotHarvesterPlotsFailedProps) {
  const { peerId } = props;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const subPeerId = peerId.substring(2);
  const { noKeyFilenames, isLoading: isLoadingHarvester } = useGetHarvesterQuery({
    peerId,
  });
  const { isLoading: isLoadingHarvesterPlots, data = [] } = useGetHarvesterPlotsInvalidQuery({
    peerId: subPeerId,
    page: page + 1,
    pageSize,
  });

  const isLoading = isLoadingHarvester || isLoadingHarvesterPlots;
  const count = noKeyFilenames ?? 0;

  function handlePageChange(rowsPerPage: number, page: number) {
    setPageSize(rowsPerPage);
    setPage(page);
  }

  return (
    <TableControlled
      cols={cols}
      rows={data}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      page={page}
      rowsPerPage={pageSize}
      count={count}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      expandedCellShift={1}
      uniqueField="filename"
      caption={!noKeyFilenames && (
        <Typography variant="body2" align="center">
          <Trans>Hooray, no files here!</Trans>
        </Typography>
      )}
      pages={!!noKeyFilenames}
    />
  );
}
