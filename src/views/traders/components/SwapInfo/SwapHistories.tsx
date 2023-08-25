import React, { useEffect, useRef, useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { ReactComponent as IconExplorer } from '../../../../assets/icons/ic-explorer.svg';
import { getChainConfig, getTokenByAddress } from '../../../../config';
import { Loading } from '../../../../components/Loading';
import { SwapPrice } from './components/SwapPrice';
import { SwapAmount } from './components/SwapAmount';
import { unixToDate } from '../../../../utils';
import { TableContentLoader } from '../../../../components/TableContentLoader';
import { Pagination } from '../../../../components/Pagination';
import { formatCurrency } from '../../../../utils/numbers';
import { useQuery } from '@tanstack/react-query';
import { querySwapHistories } from '../../../../utils/queries';
import { chainOptions } from '../../../positions/hooks/usePositionsConfig';
import { chainLogos } from '../../../../utils/constant';
import { SwapHistoriesResponse } from '../../../../utils/type';
import { Dropdown } from '../../../../components/Dropdown';
import c from 'classnames';

interface SwapHistoriesProps {
  wallet: string;
}
export const SwapHistories: React.FC<SwapHistoriesProps> = ({ wallet }) => {
  const [chainId, setChainId] = useState<number>();
  const [response, setResponse] = useState<SwapHistoriesResponse>();
  const [page, setPage] = useState(1);

  const headerRef = useRef<HTMLDivElement>();
  const { data, isInitialLoading } = useQuery(
    querySwapHistories({
      page: page,
      size: 10,
      wallet: wallet,
      chainId: chainId,
    }),
  );

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }
    setResponse(data);
  }, [data, isInitialLoading]);
  const items = response ? response.data : [];
  const pageInfo = response ? response.page : undefined;

  return (
    <div>
      <div
        className={c(
          'flex flex-col mb-20px xl:(flex-row items-center mb-10px)',
          '[&>div]:(grid grid-rows-[auto_auto] gap-y-10px items-center xl:(grid-cols-[auto_130px]))',
          '[&>div>label]:(text-12px mr-4px xl:(text-16px))',
        )}
      >
        <div>
          <label className="color-#cdcdcd">CHAIN:</label>
          <Dropdown
            defaultValue={chainOptions[0]}
            options={chainOptions}
            value={chainOptions.find((c) => c.value === chainId)}
            className="color-white uppercase"
            onChange={(item) => {
              setChainId(item.value);
            }}
          />
        </div>
      </div>
      {isInitialLoading && !items.length ? (
        <div className="h-250px flex items-center justify-center">
          <div className="w-50% max-w-200px">
            <Loading />
          </div>
        </div>
      ) : !items.length ? (
        <div className="h-250px flex justify-center items-center">
          <NoData />
        </div>
      ) : (
        <div className="relative">
          <div className="xl:table w-100% xl:border-spacing-y-12px">
            <div ref={headerRef} className="hidden xl:table-row [&>.table-cell]:px-17px">
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Time</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Type</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">From</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">To</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Price</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Fees Paid</label>
              </div>
              <div className="table-cell">
                <label className="text-14px color-#cdcdcd">Chain</label>
              </div>
              <span></span>
            </div>
            {items.map((item, i) => {
              const tokenIn = getTokenByAddress(item.tokenIn, item.chainId);
              const tokenOut = getTokenByAddress(item.tokenOut, item.chainId);
              const price = item.amountOut / item.amountIn;
              const chainConfig = getChainConfig(item.chainId);
              return (
                <a
                  href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                  target="_blank"
                  className="xl:table-row xl:h-56px [&>.vertical-middle]:px-15px [&>.vertical-middle]:py-12px cursor-pointer no-underline [&:hover>.vertical-middle]:bg-#5E5E5E [&:hover_svg_path]:fill-primary"
                  key={i}
                >
                  <div className="xl:hidden bg-#34343B p-14px rounded-10px mb-12px">
                    <div className="flex justify-between text-12px xl:(text-14px)">
                      <span className="color-#cdcdcd">Type</span>
                      <span className="color-white">{item.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">From</span>
                      <div className="-my-3px">
                        <SwapAmount amount={item.amountIn} size={20} token={tokenIn} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">To (Min receive)</span>
                      <div className="-my-3px">
                        <SwapAmount amount={item.amountOut} size={20} token={tokenOut} />
                      </div>
                    </div>
                    <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">Price</span>
                      <SwapPrice
                        tokenIn={tokenIn}
                        tokenOut={tokenOut}
                        price={price}
                        priceDirection="="
                      />
                    </div>
                    <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">Time</span>
                      <span className="color-white">{unixToDate(item.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">Fees Paid</span>
                      <span className="color-white">{formatCurrency(item.fee)}</span>
                    </div>
                    <div className="flex justify-between text-12px xl:(text-14px) mt-14px">
                      <span className="color-#cdcdcd">Chain</span>
                      <div className="color-white">
                        <div className="flex items-center">
                          <img
                            src={chainLogos[item.chainId]}
                            width={18}
                            height={18}
                            className="mr-10px -my-10px"
                          />
                          <span className="color-white whitespace-nowrap">
                            {chainConfig.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-16px pt-14px b-t-1px b-dashed b-#5E5E5E">
                      <a
                        href={`${chainConfig.baseExplorer}/tx/${item.transactionHash}`}
                        target="_blank"
                        className="[&:hover_svg_path]:fill-primary color-#ADABAB no-underline flex justify-end items-center text-12px xl:(text-14px)"
                      >
                        View
                        <IconExplorer className="ml-8px w-12px" />
                      </a>
                    </div>
                  </div>

                  <div className="hidden xl:table-cell vertical-middle bg-#34343B rounded-l-10px">
                    <span className="color-white">{unixToDate(item.createdAt)}</span>
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <span className="color-white">{item.type}</span>
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <SwapAmount size={32} token={tokenIn} amount={item.amountIn} />
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <SwapAmount size={32} token={tokenOut} amount={item.amountOut} />
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <SwapPrice
                      tokenIn={tokenIn}
                      tokenOut={tokenOut}
                      price={price}
                      priceDirection="="
                    />
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <span className="color-white">{formatCurrency(item.fee)}</span>
                  </div>
                  <div className="hidden xl:table-cell vertical-middle bg-#34343B">
                    <div className="flex items-center">
                      <img
                        src={chainLogos[item.chainId]}
                        width={18}
                        height={18}
                        className="mr-10px"
                      />
                      <span className="color-white whitespace-nowrap">{chainConfig.name}</span>
                    </div>
                  </div>
                  <span className="hidden xl:table-cell vertical-middle bg-#34343B rounded-r-10px w-1%">
                    <IconExplorer />
                  </span>
                </a>
              );
            })}
          </div>
          {isInitialLoading && !!items.length && (
            <div className="hidden xl:block absolute bottom-0 left-0 w-100%">
              <TableContentLoader
                className="h-56px mb-12px bg-#34343B b-1px b-solid b-#5E5E5E rounded-10px"
                header={headerRef.current}
                length={items.length}
                itemHeight={56}
              />
            </div>
          )}
        </div>
      )}
      {pageInfo?.total > 1 && (
        <div className="flex justify-end pt-8px">
          <Pagination current={pageInfo.current} total={pageInfo.total} onChange={setPage} />
        </div>
      )}
    </div>
  );
};
