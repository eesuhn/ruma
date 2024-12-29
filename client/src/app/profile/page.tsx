import { Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import useSWR from 'swr';
import { getAttendeePda, getUserPda } from '@/lib/pda';
import {
  getEditionAcc,
  getMasterEditionAcc,
  getMasterOrPrintedEditionPda,
  getMetadataAcc,
  getMetadataPda,
} from '@/lib/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { PublicKey } from '@solana/web3.js';

export default function Page() {
  const { publicKey } = useWallet();
  const { getUserAcc, getAllEventAcc, getAttendeeAcc } = useAnchorProgram();
  const {
    data: profileData,
    isLoading,
    error,
  } = useSWR(async () => {
    const userPda = getUserPda(publicKey!);
    const userAcc = await getUserAcc(userPda);
    const allEvents = await getAllEventAcc();

    const badges = await Promise.all(
      userAcc!.badges.map(async (badge) => {
        const { name, uri } = await getMetadataAcc(getMetadataPda(badge));
        const { publicKey: userBadgePda, parent } = await getEditionAcc(
          getMasterOrPrintedEditionPda(badge)
        );
        const { publicKey: eventBadgePda } = await getMasterEditionAcc(
          getMasterOrPrintedEditionPda(toWeb3JsPublicKey(parent))
        );
        const eventBadge = toWeb3JsPublicKey(eventBadgePda);
        const matchedEvent = allEvents.find(({ account }) =>
          account.badge?.equals(eventBadge)
        );
        const eventName = matchedEvent?.account.data.name ?? 'Unknown Event';

        return {
          pda: userBadgePda,
          name,
          image: uri,
          eventName,
        };
      })
    );

    let eventsHosted = 0;
    let eventsAttended = 0;

    allEvents.forEach(async ({ account, publicKey: eventPda }) => {
      if (
        account.organizer.equals(userPda) &&
        account.data.startTimestamp < Date.now()
      ) {
        eventsHosted++;
      } else {
        const attendeeAcc = await getAttendeeAcc(
          getAttendeePda(userPda, eventPda)
        );

        if (attendeeAcc && attendeeAcc.status.checkedIn) {
          eventsAttended++;
        }
      }
    });

    return { userAcc, badges, eventsHosted, eventsAttended };
  });

  // TODO: add error and loading states
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  if (profileData) {
    const { userAcc, badges, eventsHosted, eventsAttended } = profileData;

    return (
      profileData && (
        <div className="mx-auto max-w-2xl space-y-8 p-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20">
                    <Image
                      src={userAcc.data.image}
                      alt="Profile"
                      className="rounded-full"
                      width={80}
                      height={80}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">
                        {userAcc.data.name}
                      </h1>
                    </div>
                    <div className="mt-2 flex gap-6">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>{eventsHosted}</strong> Hosted
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>{eventsAttended}</strong> Attended
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            {Boolean(badges.length) ? (
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Badges Collection
                </h2>
                <div className="grid grid-cols-6">
                  {badges.map(
                    ({
                      pda,
                      name,
                      image,
                      eventName,
                    }: {
                      pda: PublicKey;
                      name: string;
                      image: string;
                      eventName: string;
                    }) => (
                      <TooltipProvider key={pda.toBase58()}>
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-default">
                            <div>
                              <Image
                                src={image}
                                alt={name}
                                width={80}
                                height={80}
                                className="rounded-xl"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              <strong>{name}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              From: {eventName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  )}
                </div>
              </div>
            ) : (
              <h2 className="mt-12 text-center text-xl font-bold">
                No badges Collected
              </h2>
            )}
          </div>
        </div>
      )
    );
  }
}
